# Frontend Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_MAIN_URL=http://localhost:5000/api

# Stripe Public Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51RWiCoBAWXOwFzAM9uI26BXVPUQGZCGGCRSuEFpe345jczQflWCI869VcBCzosFiu0RlS3sbnz0knGIHqpjLXXQ200ZMLk4JB5
```

## Environment Variable Details

### `NEXT_PUBLIC_MAIN_URL`
- **Purpose**: Base URL for API requests
- **Format**: `http://localhost:5000/api` (development) or `https://yourdomain.com/api` (production)
- **Used in**: `frontend/src/common/utils/api.js`
- **Note**: Must start with `NEXT_PUBLIC_` to be accessible in the browser

### `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- **Purpose**: Stripe publishable key for client-side Stripe.js integration
- **Format**: Starts with `pk_test_` (test mode) or `pk_live_` (production)
- **Used for**: 
  - Payment method collection (when implemented)
  - Stripe Elements integration
  - Client-side Stripe operations
- **Note**: This is safe to expose in the frontend (public key)

## Production Environment Variables

For production, update your `.env.local` or set these in your hosting platform:

```env
# Production API URL
NEXT_PUBLIC_MAIN_URL=https://api.yourdomain.com/api

# Production Stripe Public Key (get from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

## Next.js Environment Variable Rules

1. **Client-side variables** must be prefixed with `NEXT_PUBLIC_`
2. **Server-side variables** (without `NEXT_PUBLIC_`) are only available in API routes and server components
3. **`.env.local`** is for local development and should be in `.gitignore`
4. **`.env.production`** can be used for production builds

## Current Usage

### API Configuration
The frontend currently uses `NEXT_PUBLIC_MAIN_URL` in:
- `frontend/src/common/utils/api.js` - Axios base URL configuration
- `frontend/src/components/settings/payments/payout-methods/use-payout-method.hook.js` - Stripe onboarding URL construction

### Stripe Integration Status
- ✅ **Creator Side**: Stripe Connect onboarding is implemented (redirects to Stripe-hosted pages)
- ⚠️ **Brand Side**: Payment method collection not yet implemented
  - When implemented, will use `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` with Stripe Elements
  - Will need to install `@stripe/stripe-js` and `@stripe/react-stripe-js` packages

## Future Implementation: Brand Payment Method Collection

When implementing payment method collection for brands, you'll need:

1. **Install Stripe packages**:
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Initialize Stripe**:
   ```javascript
   import { loadStripe } from '@stripe/stripe-js';
   
   const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
   ```

3. **Use Stripe Elements** for secure card collection

## Setup Instructions

1. **Create `.env.local` file** in the `frontend` directory:
   ```bash
   cd frontend
   touch .env.local
   ```

2. **Add the environment variables** (see above)

3. **Restart the Next.js dev server**:
   ```bash
   npm run dev
   ```

4. **Verify** the variables are loaded:
   - Check browser console for any API connection errors
   - Verify API calls are going to the correct backend URL

## Troubleshooting

### Variables not loading?
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access
- Restart the Next.js dev server after adding/changing variables
- Check that `.env.local` is in the `frontend` directory (not root)

### API connection issues?
- Verify `NEXT_PUBLIC_MAIN_URL` matches your backend server URL
- Check that the backend server is running
- Ensure CORS is properly configured on the backend

### Stripe not working?
- Verify `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` is set correctly
- Ensure you're using the test key (`pk_test_...`) for development
- Check Stripe Dashboard for any account issues
