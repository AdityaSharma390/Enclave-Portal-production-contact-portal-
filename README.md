# Enclave Portal - Production-Ready Secure Contact Management Portal

Enclave Portal is a secure, state-of-the-art contact management system developed with modern full-stack engineering standards. It demonstrates a secure Express.js backend with JWT authentication, Winston/Morgan logging, Helmet security, rate limiting, and Zod validator schemas alongside a responsive React (Vite) frontend styled with Tailwind CSS supporting a light/dark aesthetic dashboard, drag-and-drop picture uploads, and list search/filters/pagination.

## Tech Stack Overview

- **Frontend**: React.js (Vite), Tailwind CSS, Axios, Lucide Icons, React Router v6
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Validation**: Zod (inputs verification)
- **Security**: Helmet, CORS, Express Rate Limit, BCrypt.js password hashing, JWT authorization
- **Logs**: Morgan HTTP logger stream redirection to Winston files logs (`logs/combined.log`, `logs/error.log`)
- **Cloud integration**: Multer, Cloudinary (with local disk fallbacks if credentials are omitted), Nodemailer SMTP triggers (with Ethereal testing account fallbacks)

---

## Directory Project Layout

```
enclave-portal/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI components (Layout, Sidebar, Skeletons, Modals)
│   │   ├── pages/          # View Pages (Dashboard, Contacts, Forms, Login)
│   │   ├── services/       # Axios API integration layers
│   │   ├── context/        # React Global contexts (Auth, Theme)
│   │   ├── hooks/          # Custom hooks (useAuth, useTheme)
│   │   └── utils/          # Helpers (Initials, date formatting)
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                 # Express Backend
    ├── config/             # DB, Mail, Winston, Cloudinary setup
    ├── controllers/        # Auth & Contacts CRUD controller logic
    ├── middleware/         # Security, JWT auth, Multer, Error handlers
    ├── models/             # Mongoose schemas (User, Contact)
    ├── routes/             # Router endpoints (Auth, Contacts)
    ├── validators/         # Input schemas validation (Zod)
    ├── utils/              # Custom ApiError helpers
    ├── logs/               # Saved log files (gitignored)
    ├── uploads/            # Local image uploads fallback directory (gitignored)
    └── server.js           # Express application startup
```

---

## Configuration & Environment Variables

Create a `.env` file in the `server/` directory. (See `server/.env.example` as a template).

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/enclave_portal
JWT_SECRET=supersecretjwtsecretkeychangeinproduction123!
JWT_EXPIRES_IN=1d

# SMTP configurations (For email alerts. Defaults to test Ethereal account if blank)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@enclaveportal.com

# Cloudinary credentials (For avatar pictures. Defaults to local server disk if blank)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
```

---

## Local Installation Guide

### Prerequisites
- Node.js (v16+)
- MongoDB running locally (or MongoDB Atlas URI)

### Step 1: Install Server Dependencies
```bash
cd server
npm install
```

### Step 2: Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 3: Run the Development Servers

1. **Start the Backend server** (runs on port 5000):
   ```bash
   cd server
   npm run dev
   ```
2. **Start the Frontend client** (runs on port 3000):
   ```bash
   cd client
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Verifications

- **Validation checks**: Attempts to submit login/register/contacts forms with empty or invalid formats will return client-side warnings and backend `Zod` error lists.
- **Protected routes**: Accessing page URLs like `/contacts` without logging in redirects directly to `/login`.
- **Emails / Upload Fallback checks**: Check the console outputs in `server/` after saving new contacts to view generated file fallback URLs or ethereal preview email testing logs.
