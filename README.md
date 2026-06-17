# Djerba Houches - Tourism Platform

Modern tourism platform for Djerba traditional house rentals.

## Quick Start

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Node.js)
```bash
cd backend
npm install
npm run dev
```

## Build for Production

```bash
# Frontend build
cd frontend && npm run build

# Output: /frontend/dist (ready for hosting)
```

## Deployment

1. Build the frontend: `npm run build`
2. Upload contents of `frontend/dist/` to your web server
3. Configure your web server to serve `index.html` for SPA routing

## Environment Variables

Create `.env` in backend:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
```

## Features

- Property listings with seasonal pricing
- Admin panel for content management
- Booking system with payment integration
- Multilanguage support (FR/EN)
- Mobile-responsive design