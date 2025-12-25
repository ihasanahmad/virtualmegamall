# Virtual Mega Mall - Customer Frontend

Customer-facing e-commerce application for Virtual Mega Mall.

## Features

- ✅ Product browsing and search
- ✅ Shopping cart with localStorage persistence
- ✅ Product comparison (up to 4 items)
- ✅ Premium dark theme UI
- ✅ Responsive design
- 🚧 Full product catalog (in development)
- 🚧 Checkout flow (Phase 5)

## Tech Stack

- React 18 + Vite
- Material-UI
- React Router v6
- Axios
- React Slick (carousels)
- Context API (state management)

## Getting Started

### Prerequisites

- Node.js (v14+)
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Customer frontend will be at `http://localhost:5173`

## Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Current Implementation

### Context Providers

1. **CartContext**
   - Add/remove items from cart
   - Update quantities
   - Cart count badge
   - Total price calculation
   - localStorage persistence

2. **ComparisonContext**
   - Add/remove products (max 4)
   - Comparison page
   - Comparison count badge
   - localStorage persistence

### Layout Components

- **Header**: Logo, search bar, cart badge, comparison badge, auth buttons
- **Footer**: Links, branding
- **CustomerLayout**: Wrapper with header + footer

### Pages (Placeholders)

- `/` - Homepage
- `/products` - Product catalog
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/comparison` - Product comparison
- `/login` - Login/Register

## Next Steps

Phase 4 continuation will include:
- Homepage with hero carousel
- Product catalog with filters
- Product cards with add to cart
- Product details page
- Full comparison table
- Login/register forms

## License

Proprietary - Virtual Mega Mall
