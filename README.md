# 3D Furniture Design Studio

A modern web application for visualizing and designing furniture layouts in 3D spaces.

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT with bcrypt
- **Email:** Nodemailer (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furniture-design-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   cd ..
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE furniture_db;
   CREATE USER dinithiwijesinghe WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE furniture_db TO dinithiwijesinghe;
   ```

4. **Run database migrations**
   ```bash
   cd server
   psql -U dinithiwijesinghe -d furniture_db -f database/schema.sql
   psql -U dinithiwijesinghe -d furniture_db -f database/add-reset-tokens.sql
   ```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL=postgresql://dinithiwijesinghe:your_password@localhost:5432/furniture_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# SMTP Configuration (optional - for email sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SECURE=false
FROM_EMAIL=your-email@gmail.com
```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```
   Server runs on http://localhost:3001

2. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## Features

### Authentication
- User registration and login
- Password reset via email
- JWT-based session management

### Dashboard
- Project analytics and statistics
- Recent projects overview
- Furniture usage insights

### Design Tools
- 2D and 3D furniture placement
- Room configuration
- Material and color customization

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user info

### Analytics
- `GET /api/analytics?userId=<id>` - Get user analytics

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Furniture
- `GET /api/furniture` - List available furniture
- `POST /api/furniture` - Add new furniture item

## Testing

### Password Reset Flow

1. **Register a test user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

2. **Request password reset:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```
   If SMTP is not configured, the response will include a `resetToken` for testing.

3. **Reset password:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token":"your-reset-token","newPassword":"newpassword123"}'
   ```

### Frontend Testing

1. Visit http://localhost:3000/signup to create an account
2. Visit http://localhost:3000/login to log in
3. Visit http://localhost:3000/dashboard to see analytics
4. Visit http://localhost:3000/forgot-password to test password reset

## Development

### Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/         # Authentication pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   └── ...
│   ├── components/         # React components
│   ├── context/           # React context providers
│   └── lib/               # Utilities and configurations
├── server/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Authentication middleware
│   │   └── config/        # Database configuration
│   └── database/          # SQL migrations
└── public/               # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## 👥 Team
| Role | Member | Contribution |
|------|--------|--------------|
| 🎨 UI/UX Designer | Person 1 | Wireframes, Figma prototypes |
| 💻 Frontend Dev | Person 2 | Java Swing UI |
| 🖼️ Graphics Dev | Person 3 | 2D/3D rendering |
| 🗄️ Backend Dev | Person 4 | Data storage & CRUD |
| 🧪 QA & Testing | Person 5 | Usability studies |
| 📋 Scrum Master | Person 6 | Sprint planning & coordination |

---

## 🚀 Getting Started
Clone the repo and run locally:

```bash
git clone https://github.com/YOUR-USERNAME/furniture-design-studio.git
cd furniture-design-studio
