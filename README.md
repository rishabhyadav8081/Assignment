# CartNest — Role-Based E-Commerce Platform

CartNest is a full-stack MERN e-commerce project built for an internship assignment. It has three roles with permissions enforced by the Express API, Cloudinary image uploads, and Razorpay test checkout with server-side signature verification.

## Stack

- React 19, Vite, Tailwind CSS
- Node.js, Express, MongoDB, Mongoose
- JWT authentication and bcrypt password hashing
- Cloudinary image storage
- Razorpay test payments
- Render backend and Vercel frontend configuration

## Features

- Public product search and category/price filters
- Customer cart, wishlist, checkout, and order history
- Sales people can create, edit, and delete only their products and see relevant orders
- Admin can manage every product, user roles, order statuses, and sales stats
- Product images are streamed from memory to Cloudinary; no raw images are stored by the server
- The backend recomputes totals and verifies Razorpay signatures before creating an order

## Project structure

```text
cartnest/
├── backend/
│   └── src/
│       ├── config/       database and Cloudinary setup
│       ├── controllers/  request handling and business rules
│       ├── middleware/   authentication, roles, uploads, errors
│       ├── models/       Mongoose schemas
│       ├── routes/       API routes
│       └── utils/
├── frontend/
│   └── src/
│       ├── api/          Axios client
│       ├── components/   shared UI
│       ├── context/      authentication and shop state
│       └── pages/        route pages
└── render.yaml
```

## Run locally

Requirements: Node.js 20+ and MongoDB Community Server running locally.

1. The local backend is configured to use `mongodb://localhost:27017/task` in `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. From the project root, run:

```bash
npm install
npm run install:all
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:5001/api/health`

The frontend API URL is centralized in `frontend/src/api/apiEndpoints.js`. After deploying the backend, change only `BASE_API_URL` in that file.

## Demo accounts

Run `npm run seed` after configuring MongoDB.

| Role | Email | Password |
|---|---|---|
| Admin | admin@cartnest.com | Admin123! |
| Sales Person | sales@cartnest.com | Sales123! |
| User | user@cartnest.com | User123! |

Change these credentials before using the application outside a demonstration.

## External service setup

### MongoDB Atlas

1. Create a free account at MongoDB Atlas and create an M0 cluster.
2. In **Database Access**, create a database user.
3. In **Network Access**, allow your current IP for local work. Render needs network access too; for a demo, add `0.0.0.0/0` and use a strong database password.
4. Select **Connect → Drivers**, copy the connection string, replace its password, and set it as `MONGODB_URI`.

### Cloudinary

1. Create a free Cloudinary account.
2. Open the dashboard and copy the Cloud Name, API Key, and API Secret.
3. Put them in the matching `CLOUDINARY_*` variables in `backend/.env` and later in Render.
4. The app creates the `cartnest/products` folder automatically on the first upload.

### Razorpay test mode

1. Create a Razorpay account and complete the requested account details. Real activation is not needed for test payments.
2. Switch the dashboard to **Test Mode**.
3. Open **Account & Settings → API Keys** and generate a test key.
4. Add the key ID and secret to `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. The secret belongs only on the backend.
5. During checkout use a Razorpay test payment method from their test-mode documentation. No real money is charged.

## Deployment
## seed 
{ name: 'Admin Demo', email: 'admin@assignment.com', password: 'Admin@123', role: 'admin' },
  { name: 'Sales Demo', email: 'sales@assignment.com', password: 'Sales@123', role: 'sales' },
  { name: 'Customer Demo', email: 'user@assignment.com', password: 'User@123', role: 'user' }
### Backend on Render

1. Push the repository to GitHub and create a **Web Service** on Render.
2. Set the root directory to `backend`, build command to `npm install`, and start command to `npm start`. The included `render.yaml` can also create this service.
3. Add all values from `backend/.env.example`. Set `FRONTEND_URL` to the final Vercel URL.
4. After deployment, check `https://YOUR-RENDER-URL/api/health`.
5. Run the seed command locally against the Atlas database, or use Render Shell if available.

### Frontend on Vercel

1. Import the same repository and set the root directory to `frontend`.
2. Vercel detects Vite. The build command is `npm run build` and output directory is `dist`.
3. Add `VITE_API_URL=https://YOUR-RENDER-URL/api`.
4. Deploy, copy the URL, then update Render's `FRONTEND_URL` and redeploy the backend.

## Suggested Git history

This generated workspace is intentionally not committed for you. Create the history yourself as you understand and test each milestone:

1. `chore: set up frontend and backend projects`
2. `feat: add database models and authentication`
3. `feat: enforce role based product permissions`
4. `feat: add cloudinary product image uploads`
5. `feat: build product listing and filters`
6. `feat: add wishlist and cart`
7. Create branch `feature/razorpay-checkout`
8. `feat: add razorpay checkout and verification`
9. Push that branch and open a Pull Request into `main`
10. `feat: add order and role dashboards`
11. `docs: add setup and deployment guide`

Do not manufacture old commits after finishing. Commit at the end of each real milestone, and be prepared to explain every change in the review.

## API overview

| Area | Main routes |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | `GET /api/products`, protected create/update/delete |
| Cart/Wishlist | `/api/cart`, `/api/wishlist` |
| Payment | `POST /api/orders/payment/create`, `POST /api/orders/payment/verify` |
| Orders | customer `/mine`, sales `/seller`, admin `/` and `/stats` |
| Users | admin-only `/api/users` and role update |

## Screenshots

Add 2–3 screenshots here after running the application with real Cloudinary product images:

- Storefront and filters
- Cart/Razorpay test checkout
- Admin or sales dashboard

## Important review notes

- Frontend route guards are for user experience only. Every protected operation is also checked in backend middleware/controllers.
- Public registration always creates a normal user. Only an admin can promote an account.
- Product ownership is checked again before update/delete.
- Order prices and sellers come from MongoDB, never from values sent by the browser.
- A payment order is fetched from Razorpay and its amount is matched before the database order is created.
# Assignment
# Assignment
