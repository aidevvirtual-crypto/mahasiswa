# Academic Registration System Design Specification

This document outlines the design system and UI/UX guidelines for the Mahasiswa Registration & Portfolio Platform. The goal is to create an **elegant, modern, and academic** aesthetic that feels professional, trustworthy, and user-friendly.

## 1. Design Philosophy
The design follows a "Clean Academic" style:
- **Clarity over Clutter**: Ample white space and clear typography.
- **Trust & Authority**: Using deep blues and refined grays to evoke institutional reliability.
- **Modern Interactions**: Subtle transitions and glassmorphism elements to make the platform feel like a state-of-the-art academic tool.

## 2. Color Palette
- **Primary (Academic Blue)**: `#1A365D` (Deep, authoritative blue)
- **Secondary (Action Gold)**: `#D4AF37` (Subtle gold for primary buttons and highlights)
- **Background (Soft White)**: `#F7F9FC` (Off-white to reduce eye strain)
- **Accent (Modern Slate)**: `#4A5568` (For secondary text and icons)
- **Success**: `#2F855A`
- **Surface**: `#FFFFFF` (Pure white for cards/forms)

## 3. Typography
- **Headings**: *Inter* or *Outfit* (Bold, high-contrast)
- **Body**: *Inter* (Regular, 16px base, 1.6 line height for readability)
- **Monospace**: *JetBrains Mono* (For any technical identifiers)

## 4. UI Components

### A. Multi-Step Registration Form
- **Progress Stepper**: A clean, horizontal or vertical progress indicator at the top.
- **Floating Labels**: Modern input fields with smooth label transitions.
- **Conditional Cards**: Background information sections that expand/collapse based on user status (Mahasiswa/Entrepreneur/Umum).

### B. Portfolio & Video Upload
- **Drag & Drop Zones**: Highlighted zones with dashed borders for PDFs.
- **In-Browser Video Recorder**:
    - Clean camera preview with rounded corners.
    - Red recording indicator.
    - Countdown timer.
    - "Retake" and "Preview" buttons.
- **File Lists**: Interactive lists showing uploaded files with file size and "Remove" options.

### C. Admin Dashboard
- **Glassmorphism Sidebar**: Semi-transparent sidebar with active state indicators.
- **Data Table**: High-performance table with sorting, filtering, and "Quick View" modals for student profiles.
- **Status Badges**: Rounded badges (e.g., "Pending" in amber, "Approved" in emerald).

## 5. Responsive Strategy
- **Mobile-First**: The form must be easily navigable on mobile devices (one field per row, large tap targets).
- **Desktop**: Side-by-side layouts for information review in the admin panel.

## 6. Stitch MCP Integration Note

**Project ID**: `3516648773794420199`

### Generated Screens

| Screen | ID | Device |
|--------|-----|--------|
| Design System (Asset) | `c86e750bff104618a457a670c536d708` | - |
| Academic Registration System Specification | `1e411d7eca5f4a3d9e5e2badeadd52e1` | Desktop |
| Welcome & Role Selection | `2ed33579fb254a228b27adefddf57dc7` | Mobile |
| Portfolio & Video Upload | `73146d47dfa64330b4d6a7f660586ac7` | Mobile |
| Registration Form | `7868cfc88d0c42c187b998147a5e4f89` | Mobile |
| Success & Profile Preview | `0976b7a32c7f4d609c051ecac7e07170` | Mobile |
| Admin Dashboard | `2d7c48f1ab5145218ac9741aa6483788` | Desktop |
| Student Profile Detail | `6b86a26b25224b81b3b3b19b8d26d46f` | Desktop |

### Design Theme
- **Color Mode**: Light
- **Primary**: `#1A365D` (Academic Blue)
- **Secondary**: `#D4AF37` (Action Gold)
- **Fonts**: Plus Jakarta Sans (headlines), Inter (body), JetBrains Mono (monospace)
