export const mockApplications = [
    {
        id: 'app-001',
        status: 'approved',
        monthly_savings: 4200,
        total_savings: 156000,
        new_rate: 3.5,
        new_emi: 8500,
        admin_notes: null,
        rejection_reason: null,
        created_at: '2023-10-10T09:00:00Z',
        updated_at: '2023-11-01T14:30:00Z',
        user_loan: {
            id: 'loan-1',
            bank_name: 'Emirates NBD',
            loan_type: 'Personal Loan',
            remaining_amount: 350000,
            interest_rate: 6.5,
        },
        bank_product: {
            id: 'prod-1',
            name: 'Smart Consolidate Pro',
            bank: {
                name: 'Abu Dhabi Commercial Bank',
                is_islamic: false,
            },
        },
        timeline: [
            { date: '2023-10-10T09:00:00Z', status: 'submitted', note: 'Application submitted successfully to ADCB.' },
            { date: '2023-10-12T10:15:00Z', status: 'under_review', note: 'Bank processing initiated by Central Credit team.' },
            { date: '2023-10-15T08:00:00Z', status: 'documents_required', note: 'Please provide latest 3 months stamped bank statements.' },
            { date: '2023-10-16T11:20:00Z', status: 'under_review', note: 'Documents received and sent for final underwriting.' },
            { date: '2023-11-01T14:30:00Z', status: 'approved', note: 'Congratulations! Final approval obtained with 3.5% rate.' }
        ]
    },
    {
        id: 'app-002',
        status: 'documents_required',
        monthly_savings: 1800,
        total_savings: 42000,
        new_rate: 4.8,
        new_emi: 4200,
        admin_notes: 'Salary transfer letter from your HR is pending. Need wet signature.',
        rejection_reason: null,
        created_at: '2023-11-05T10:00:00Z',
        updated_at: '2023-11-12T09:15:00Z',
        user_loan: {
            id: 'loan-2',
            bank_name: 'Mashreq Bank',
            loan_type: 'Credit Card Debt',
            remaining_amount: 120000,
            interest_rate: 36.0,
        },
        bank_product: {
            id: 'prod-2',
            name: 'Islamic Finance Buyout',
            bank: {
                name: 'Dubai Islamic Bank',
                is_islamic: true,
            },
        },
        timeline: [
            { date: '2023-11-05T10:00:00Z', status: 'submitted', note: 'Buyout request routed to DIB.' },
            { date: '2023-11-08T15:45:00Z', status: 'under_review', note: 'Initial AECB check passed.' },
            { date: '2023-11-12T09:15:00Z', status: 'documents_required', note: 'Salary transfer letter from your HR is pending. Need wet signature.' }
        ]
    },
    {
        id: 'app-003',
        status: 'rejected',
        monthly_savings: 0,
        total_savings: 0,
        new_rate: 0,
        new_emi: 0,
        admin_notes: null,
        rejection_reason: 'AECB score below bank threshold of 650. Recent missed payments on auto loan.',
        created_at: '2023-09-01T12:00:00Z',
        updated_at: '2023-09-05T16:20:00Z',
        user_loan: {
            id: 'loan-3',
            bank_name: 'FAB',
            loan_type: 'Auto Loan',
            remaining_amount: 85000,
            interest_rate: 4.5,
        },
        bank_product: {
            id: 'prod-3',
            name: 'Quick Refinance',
            bank: {
                name: 'RAKBANK',
                is_islamic: false,
            },
        },
        timeline: [
            { date: '2023-09-01T12:00:00Z', status: 'submitted', note: 'Application forwarded to RAKBANK.' },
            { date: '2023-09-03T09:00:00Z', status: 'under_review', note: 'Credit assessment team evaluating file.' },
            { date: '2023-09-05T16:20:00Z', status: 'rejected', note: 'AECB score below bank threshold of 650. Recent missed payments on auto loan.' }
        ]
    }
];

// This represents the shape we expect in our final DB state, 
// matching Supabase tables: \`refinance_applications\` and an upcoming \`application_timeline\` table.
