# Supabase Migrations Not In Live History

These files were preserved during the 2026-05-13 Supabase baseline work because
they existed locally but were not recorded in the linked live project's migration
history.

Active migrations now mirror the live migration history fetched from Supabase,
plus the additive `20260513063605_backend_reproducibility_and_document_upload.sql`
migration that was applied to production for document uploads.

Do not move these files back into `supabase/migrations` without first checking
`supabase migration list`, because doing so can reintroduce local/remote drift or
duplicate object creation on fresh database resets.
