# AGENTS.md

## Project Context
Mahasiswa (student) registration system with Google OAuth login, multi-step registration forms, video/file uploads, and admin dashboard.

## Tech Stack
- **Framework**: Astro 4.x (SSR mode, Node.js adapter)
- **Database**: MySQL + Drizzle ORM
- **Auth**: Google OAuth 2.0 + session-based admin auth
- **Validation**: Zod
- **Styling**: Vanilla CSS with CSS custom properties
- **Process Manager**: PM2 (for VPS production)

## Database Config
Uses MySQL (NOT PostgreSQL despite earlier docs).
```env
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="maha_mahasiswa"
DB_PASSWORD="Mahasiswa2026!"
DB_NAME="maha_mahasiswa"
```
- Schema: `src/db/schema.ts` using `mysqlTable`
- Drizzle config: `drizzle.config.ts` with `dialect: 'mysql'`

## Key Commands
```bash
npm run build     # Build for production
npm run db:push  # Push schema to database
npm run dev      # Development server
```

## VPS Deployment (AlmaLinux/CyberPanel)
- Server: `/home/mahasiswa.visiteknologi.tech/public_html/`
- LiteSpeed/OpenLiteSpeed is used (NOT Apache httpd)
- LiteSpeed config: `/usr/local/lsws/conf/httpd_config.conf`
- VHost config: `/usr/local/lsws/conf/vhosts/mahasiswa.visiteknologi.tech/vhost.conf`
- App runs on port 4321, LiteSpeed proxies HTTPS requests
- Proxy requires `extProcessor nodeproxy` in server config with type `proxy`

## Admin Auth
- Separate from Google OAuth user login
- Admin login: `POST /api/admin/login` with email/password
- Session cookie: `admin_session` (JSON format)
- Default admin: `admin@mahasiswa.com` / `admin123`
- Middleware: `src/middleware.ts` handles session validation for `/admin/*` routes

## Protected Routes
- `/register*` - Requires Google OAuth session (`session` cookie)
- `/admin/*` - Requires admin session (`admin_session` cookie)
- `/admin/login` - Public admin login page

## Design System
- Primary: `#1A365D` (Academic Blue)
- Secondary: `#D4AF37` (Action Gold)
- Headings: Plus Jakarta Sans, Body: Inter
- Mobile-first responsive design

## File Upload Security
- Magic bytes validation required (not just extension checking)
- PDF proposals stored via `portfolio_assets` table
- Video recordings via VideoRecorder component

## Build Verification
```bash
npm run build  # Verify type safety before deploy
```