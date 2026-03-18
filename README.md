# 🪑 Mauve Studio — Furniture Design App

> A modern, browser-based interior design platform for planning, visualizing, and shopping furniture.

---

## ✨ Features

- **2D Floor Planner** — Draw your room, drag & drop furniture, snap to grid, set exact dimensions, add doors & windows
- **3D Visualization** — Switch to 3D instantly, orbit and zoom through your room in real time
- **AI Room Designer** — Generate room layout suggestions powered by Claude AI
- **Furniture Shop** — Browse real furniture pieces, customize colors, add directly to your design
- **Design Templates** — Start from pre-built room templates (Living Room, Bedroom, Office, etc.)
- **Space Analysis** — Collision detection, space utilization percentage, overlap warnings
- **Undo / Redo** — Full history with keyboard shortcuts (⌘Z / ⌘⇧Z)
- **PNG Export** — Export your 2D floor plan as an image
- **Dark Mode** — Full dark/light mode support across all pages
- **Authentication** — Secure JWT-based login, signup, forgot password flow
- **Cloud Save** — Projects auto-saved to PostgreSQL database

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React 18, TypeScript, JSX |
| **3D Rendering** | React Three Fiber, @react-three/drei |
| **Animations** | Framer Motion |
| **Styling** | Tailwind CSS, Inline styles (glass morphism UI) |
| **Database** | PostgreSQL (via pg Pool) |
| **Authentication** | JWT (jsonwebtoken), bcryptjs, HttpOnly cookies |
| **AI Integration** | Anthropic Claude API |
| **Canvas** | HTML5 Canvas API (2D editor) |
| **Font** | Afacad (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- npm

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/dinethmikavindya/furniture-design-app.git
cd furniture-design-app
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`
Open \`.env.local\` and fill in your values:
\`\`\`env
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/furniture_db
JWT_SECRET=your-super-secret-jwt-key
ANTHROPIC_API_KEY=your-anthropic-api-key
\`\`\`

### 4. Set up the database
\`\`\`bash
createdb furniture_db
psql -d furniture_db -f server/database/schema.sql
psql -d furniture_db -f server/database/furniture-data.sql
\`\`\`

### 5. Run the app
\`\`\`bash
npm run dev
\`\`\`
Open http://localhost:3000

---

## 📁 Project Structure
\`\`\`
src/
├── app/
│   ├── (auth)/          # Login, Signup, Forgot Password pages
│   ├── api/             # API routes (auth, projects, templates, AI)
│   ├── dashboard/       # Main dashboard
│   ├── editor/
│   │   ├── 2d/          # 2D canvas editor
│   │   └── 3d/          # 3D room viewer
│   ├── projects/        # Projects list
│   ├── shop/            # Furniture shop
│   ├── materials/       # Materials browser
│   └── settings/        # User settings
├── components/
│   ├── auth/            # Login, Signup components
│   ├── dashboard/       # Dashboard widgets
│   └── layout/          # Shared layout
├── context/
│   └── AuthContext.tsx  # Global auth state
└── lib/
    └── middleware/      # JWT verification
\`\`\`

---

## 👥 Team

| Name | Student ID | Branch |
|---|---|---|
| Dinethi Mikavindya | 10952856 | 10952856-DinethmiW |
| Dinithi Wijesinghe | 10952811 | 10952811-Dinithi-Wijesinghe |
| Sandil S | 10952855 | 10952855-SandilS |
| Kaveen Perera | 10953499 | 10953499-KaveenPerera |

---

## 📝 Notes
- \`.env.local\` is not included for security. Use \`.env.example\` as a template.
- AI features require an Anthropic API key. App works without it.
- Make sure PostgreSQL is running before starting the app.
