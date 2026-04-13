# AGENTS.md

## Project Context
This is a **planned but not yet implemented** mahasiswa (student) registration system. The codebase contains design docs but no code yet.

## Tech Stack (Planned)
- **Framework**: Astro (SSR mode)
- **Database**: MySQL + Drizzle ORM
- **Auth**: Better Auth (Google OAuth 2.0)
- **Validation**: Zod
- **Styling**: Vanilla CSS

## Required Environment Variables
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `DATABASE_URL` - MySQL connection string

## Development Notes
- MySQL can come from XAMPP (use XAMPP's MySQL, not PHP)
- The app needs Node.js hosting (Vercel, Netlify, Railway, or VPS)
- Run `npm run build` to verify type safety

## Design System
- Primary: `#1A365D` (Academic Blue)
- Secondary: `#D4AF37` (Action Gold)
- Headings: Inter/Outfit, Body: Inter
- Mobile-first responsive design

## Verification
- Build: `npm run build`
- Magic bytes validation required for file uploads (not just extension checking)
- Drizzle ORM provides SQL injection protection