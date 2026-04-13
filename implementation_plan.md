# Mahasiswa Registration & Portfolio Platform (Astro Edition)

This plan outlines the development of a high-performance, secure, and modern web application using **Astro** and **MySQL**.

## User Review Required

> [!IMPORTANT]
> - **Framework Shift**: Moving from PHP to Astro for better performance and developer experience.
> - **Hosting**: This requires a Node.js compatible environment (Vercel, Netlify, Railway, or a VPS with Node.js). XAMPP is no longer the primary runtime (though MySQL from XAMPP can still be used).
> - **Google credentials**: You will need to provide a `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from the [Google Cloud Console](https://console.cloud.google.com/).
> - **Security**: All file uploads will undergo strict MIME type and magic bytes verification.

## Proposed Changes

### 1. Modern Tech Stack
- **Framework**: Astro (SSR Mode)
- **Database**: MySQL (via Drizzle ORM for type-safe queries and injection protection)
- **Authenticaton**: Better Auth (Google OAuth 2.0)
- **Validation**: Zod (Schema-based validation for all forms and APIs)
- **Styling**: Vanilla CSS (Modern, elegant academic design)

---

### 2. Database Schema (MySQL + Drizzle)
We will use Drizzle ORM to manage the MySQL schema securely.

#### [NEW] `schema.ts`(file:///c:/xampp/htdocs/mahasiswa/src/db/schema.ts)
- `users`: Stores core user data from Google Login.
- `registrations`: Main registration details (NIK, DOB, Status, etc.).
- `portfolio_assets`: Paths to PDF proposals and video submissions.
- `sessions`: Persistent login sessions.

---

### 3. Frontend & Forms (Astro)
A responsive, multi-step interface with client-side enhancements.

#### [NEW] `index.astro`(file:///c:/xampp/htdocs/mahasiswa/src/pages/index.astro)
- Landing page with Google Login integration.
- Dynamic multi-step form components.

#### [NEW] `register.astro`(file:///c:/xampp/htdocs/mahasiswa/src/pages/register/index.astro)
- Protected route for the registration form.
- Progress tracking and persistent state.

#### [NEW] `VideoRecorder.astro`(file:///c:/xampp/htdocs/mahasiswa/src/components/VideoRecorder.astro)
- Highly polished video recording component with real-time feedback.

---

### 4. Security & API
Strict enforcement of data integrity and safe file handling.

#### [NEW] `api/submit.ts`(file:///c:/xampp/htdocs/mahasiswa/src/pages/api/submit.ts)
- **Zod Validation**: Rejects any malformed or malicious data payloads.
- **File Validation**: 
    - Verify file extensions AND magic bytes (binary headers).
    - Rate limit total uploads per user.
    - Sanitize filenames to prevent path traversal attacks.

---

### 5. Admin Dashboard
Secure management portal for academic administrators.

#### [NEW] `admin/dashboard.astro`(file:///c:/xampp/htdocs/mahasiswa/src/pages/admin/dashboard.astro)
- Overview analytics.
- Detail view for video portfolios and student proposals.
- Approval workflow.

## Open Questions

> [!NOTE]
> 1. Do you have a preferred Google Cloud Project already set up?
> 2. For "false file upload" protection, should we restrict uploads to specific regions/IPs or just stick to binary verification?

## Verification Plan

### Automated Tests
- `npm run build` to ensure type safety.
- Mocking malformed Google tokens to test auth resilience.
- Uploading a renamed `.txt` file as `.pdf` to verify magic bytes rejection.

### Manual Verification
1. Perform Google Login.
2. Complete multi-step form on a mobile device.
3. Record a video and verify it plays back in the admin dashboard.
4. Attempt a SQL injection string in a text field and verify rejection by Drizzle.
