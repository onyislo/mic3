# MIC3 Solutions Group Frontend

This is the frontend application for MIC3 Solutions Group, built with React, TypeScript, and Tailwind CSS.

## Features

- Responsive design for various screen sizes
- Admin dashboard with analytics, user management, and course management
- User authentication system with email verification
- Course browsing and registration
- Portfolio showcase
- Contact form
- Course progress tracking and badge system
- User enrollment and payment management

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Supabase for backend (authentication, database, and storage)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/onyislo/mic3.git
   cd mic3
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase URL and anon key

4. Set up Supabase:
   - Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

5. Start the development server:
   ```
   npm run dev
   ```

## Build for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Contact

For any inquiries, please reach out to MIC3 Solutions Group through the contact form on the website.
