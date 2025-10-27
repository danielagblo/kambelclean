# BestLand Admin Dashboard

A full-stack web application built with Next.js, featuring a responsive admin dashboard with authentication and modern UI design using Tailwind CSS.

## Features

- 🎯 **Landing Page**: Beautiful one-page marketing site with business registration
- 🔐 **Authentication System**: Secure login/logout with JWT tokens
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean and intuitive admin interface
- 📊 **Dashboard**: Overview with statistics and recent activity
- 👥 **User Management**: Complete CRUD operations for users
- 📦 **Product Management**: Inventory and product management
- ⚙️ **Settings**: Application configuration and preferences
- 🛡️ **Route Protection**: Middleware-based authentication guards

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: Lucide React
- **Backend**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bestland
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- **Email**: admin@bestland.com
- **Password**: password

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── users/         # User management
│   │   ├── products/      # Product management
│   │   ├── settings/      # Application settings
│   │   └── layout.tsx     # Admin layout with sidebar
│   ├── api/
│   │   ├── auth/          # Authentication API routes
│   │   └── business/      # Business registration API
│   ├── landing/           # Landing page with registration form
│   ├── login/             # Login page
│   └── page.tsx           # Home page (redirects to landing)
├── lib/
│   └── auth.ts            # Authentication utilities
└── middleware.ts          # Route protection middleware
```

## API Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify` - Verify authentication token
- `POST /api/business/register` - Register new business

## Features Overview

### Landing Page
- Beautiful hero section with compelling copy
- Interactive product category grid (Electronics, Furniture, Vehicles, etc.)
- Business registration form with validation
- Key benefits and value propositions
- Connected to admin dashboard for seamless flow

### Dashboard
- Real-time statistics cards
- Recent orders and users
- Top products performance
- Quick action buttons

### User Management
- User listing with search and filters
- Add/edit/delete users
- Role-based access control
- User status management

### Product Management
- Product inventory tracking
- Stock level monitoring
- Category management
- Price and description editing

### Settings
- General application settings
- Notification preferences
- Appearance customization
- Security options
- System information

## Security Features

- JWT-based authentication
- HTTP-only cookies for token storage
- Route protection middleware
- Password hashing with bcrypt
- CSRF protection

## Customization

The application is built with modularity in mind. You can easily:

- Add new admin pages by creating new routes in `/app/admin/`
- Extend the authentication system in `/lib/auth.ts`
- Customize the UI theme by modifying Tailwind classes
- Add new API endpoints in `/app/api/`

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.