import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Unified interface for the mobile app
interface UnifiedBankOffer {
    provider_id: string;
    bank_name: string;
    approved_amount: number;
    interest_rate: number;
    tenure_months: number;
    monthly_emi: number;
    processing_fee_aed: number;
    early_settlement_fee_pct: number;
    expiry_date: string;
    is_islamic?: boolean;
    monthly_savings: number;
    total_savings: number;
}

serve(async (req: Request) => {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Init Supabase client securely using runtime env vars
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // using service role to bypass RLS for reading products
        );

        // Parse request payload
        const { user_id, user_loan_id, salary, requested_amount } = await req.json();

        if (!user_id || !user_loan_id || !salary || !requested_amount) {
            return new Response(
                JSON.stringify({ error: 'Missing required parameters: user_id, user_loan_id, salary, or requested_amount' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
        }

        console.log(`Fetching offers for loan: ${user_loan_id}, salary: ${salary}, amount: ${requested_amount}`);

        // 1. Fetch user loan details to calculate savings
        const { data: loan, error: loanError } = await supabaseClient
            .from('user_loans')
            .select('*')
            .eq('id', user_loan_id)
            .eq('user_id', user_id)
            .single();

        if (loanError || !loan) {
            return new Response(
                JSON.stringify({ error: 'Loan not found or unauthorized' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            );
        }

        // 2. Fetch matching bank products according to adapter logic
        const { data: products, error: productsError } = await supabaseClient
            .from('bank_products')
            .select(`
                id,
                name,
                interest_rate_min,
                interest_rate_max,
                min_amount,
                max_amount,
                min_tenure_months,
                max_tenure_months,
                processing_fee_pct,
                early_settlement_fee_pct,
                is_active,
                bank_id,
                banks (
                    id,
                    name,
                    is_islamic,
                    min_salary
                )
            `)
            .eq('is_active', true)
            .eq('product_type', 'personal');

        if (productsError) throw productsError;

        // Filter valid products based on user parameters
        const eligibleProducts = products.filter((p: any) => {
            const bank = p.banks;
            if (bank.min_salary && salary < bank.min_salary) return false;
            // Add loan amount restrictions
            if (p.min_amount && requested_amount < p.min_amount) return false;
            if (p.max_amount && requested_amount > p.max_amount) return false;
            return true;
        });

        const generatedOffers: UnifiedBankOffer[] = [];
        const cacheInserts: any[] = [];

        // 3. Normalization & Mapping
        for (const product of eligibleProducts) {
            const bank = product.banks;

            // Generate a simulated unified offer based on product rules
            const interestBase = product.interest_rate_min ?? 4.5; // fallback
            const maxTenure = product.max_tenure_months ?? 48; // fallback

            // Calculate a processing fee based on the percentage
            const feePct = product.processing_fee_pct ?? 1.0;
            const processing_fee_aed = (requested_amount * feePct) / 100;

            // Standard Reducing Balance EMI calculation
            const monthlyRate = interestBase / 12 / 100;
            const new_emi = requested_amount * monthlyRate * Math.pow(1 + monthlyRate, maxTenure) / (Math.pow(1 + monthlyRate, maxTenure) - 1);

            // Calculate savings based on old loan vs new loan
            const oldEmi = loan.monthly_emi;
            const monthlySavings = Math.max(0, oldEmi - new_emi);
            const grossSavings = monthlySavings * maxTenure;
            const totalSavings = Math.max(0, grossSavings - processing_fee_aed);

            if (monthlySavings <= 0) continue; // Skip if no savings

            // Expiry Date (30 days from now)
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30);

            generatedOffers.push({
                provider_id: product.id, // Mobile app needs product ID for apply routing
                bank_name: bank.name,
                approved_amount: requested_amount,
                interest_rate: interestBase,
                tenure_months: maxTenure,
                monthly_emi: parseFloat(new_emi.toFixed(2)),
                processing_fee_aed: parseFloat(processing_fee_aed.toFixed(2)),
                early_settlement_fee_pct: product.early_settlement_fee_pct ?? 1.0,
                expiry_date: expiry.toISOString(),
                is_islamic: bank.is_islamic,
                monthly_savings: parseFloat(monthlySavings.toFixed(2)),
                total_savings: parseFloat(totalSavings.toFixed(2))
            });

            // Prepare for insert into refinance_offers
            cacheInserts.push({
                user_loan_id: user_loan_id,
                bank_product_id: product.id,
                new_interest_rate: interestBase,
                new_monthly_emi: parseFloat(new_emi.toFixed(2)),
                new_tenure_months: maxTenure,
                monthly_savings: parseFloat(monthlySavings.toFixed(2)),
                total_savings: parseFloat(totalSavings.toFixed(2)),
                processing_fee: parseFloat(processing_fee_aed.toFixed(2)),
                is_recommended: totalSavings > 1000,
                status: 'pending',
                expires_at: expiry.toISOString()
            });
        }

        // 4. Cache the offers
        if (cacheInserts.length > 0) {
            // We can delete old pending offers for this loan to keep it clean
            await supabaseClient
                .from('refinance_offers')
                .delete()
                .eq('user_loan_id', user_loan_id)
                .eq('status', 'pending');

            const { error: insertError } = await supabaseClient
                .from('refinance_offers')
                .insert(cacheInserts);

            if (insertError) {
                console.error('Cache Insert Error:', insertError);
                // We keep going so we at least return results
            }
        }

        // Rank the best ones to return
        generatedOffers.sort((a, b) => b.total_savings - a.total_savings);

        return new Response(JSON.stringify(generatedOffers), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Edge Function Error:', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
