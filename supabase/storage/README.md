# Supabase Storage Seed Files

This directory contains HTML files that are automatically loaded into Supabase Storage during local development setup.

## Configuration

Storage buckets are configured in `supabase/config.toml`:

## Adding New Files

To add more seed files:
1. Create your HTML file in `./explanations/` subdirectory
2. It will be automatically included in the next `supabase db reset` or `supabase start`
3. For new grammar point explanations, follow the naming convention: `SON-{grammarPointId}.html`

