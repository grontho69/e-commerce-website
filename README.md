# Volans Clothing - Premium Bangladeshi E-commerce

A production-quality clothing website built with Next.js 15, MongoDB, GSAP, and Tailwind CSS.

## Features
- **Next.js App Router**: Modern multi-page architecture.
- **NextAuth.js**: Robust authentication with Credentials provider.
- **GSAP Animations**: Premium, high-performance scroll and entrance reveals.
- **MongoDB & Mongoose**: Scalable data management with stable connection caching.
- **LocalStorage Cart**: Persistent cart management.
- **Admin Dashboard**: Secure product and order management for administrators.
- **Responsive Design**: Mobile-first UI using shadcn/ui and Tailwind.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/e-commerce
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_string
```

### 3. Installation
```bash
npm install
```

### 4. Database Seeding
Run the application and visit the following URL to initialize the database with users and 12+ products:
`http://localhost:3000/api/seed`

### 5. Running the App
```bash
npm run dev
```

## User Credentials
- **Regular User**: `demo@site.com` / `Demo1234!`
- **Admin User**: `admin@site.com` / `Admin1234!`

## Folder Structure
- `/src/app`: Routes and API handlers.
- `/src/components`: UI components (including GSAP animations).
- `/src/lib`: MongoDB connection, Auth config, and utilities.
- `/src/models`: Mongoose schemas.
- `/public`: Static assets.

## Implementation Details
- **GSAP**: Located in `@/components/Motion.jsx` for reusable transition patterns.
- **Route Protection**: Implemented server-side using `auth()` (NextAuth v5 beta) in individual page files.
- **Cart**: Managed via `@/components/CartContext.jsx` with full persistence.
