# Render Deployment Guide — Vision Eye Care

This guide explains how to deploy the **Vision Eye Care** application to [Render](https://render.com/) with the client as a **Static Site** and the server as a **Web Service**.

---

## Quick Deploy via Render Blueprint (Recommended)

This repo includes a [`render.yaml`](../render.yaml) blueprint that configures both services automatically.

1. **Push your code** to a GitHub repository.
2. Go to [dashboard.render.com](https://dashboard.render.com).
3. Click **"New"** → **"Blueprint"**.
4. Connect your GitHub repo containing this project.
5. Render will detect `render.yaml` and show the two services:
   - `vision-eye-care-client` (Static Site)
   - `vision-eye-care-server` (Web Service)
6. **Set the required environment variables** (marked `sync: false` in the blueprint):
   - `DATABASE_URL` — Your PostgreSQL connection string (e.g. Neon)
   - `JWT_SECRET` — A strong random secret
   - `CLIENT_URL` — Your deployed client URL (e.g. `https://vision-eye-care-client.onrender.com`)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
7. Click **"Apply"** and Render will build & deploy both services.

---

## Manual Setup (Alternative)

### 1. Deploy the Server (Web Service)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **"New"** → **"Web Service"**.
2. Connect your GitHub repository.
3. Configure:
   - **Name**: `vision-eye-care-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `JWT_SECRET` | A strong random secret |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `https://vision-eye-care-client.onrender.com` |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
5. Click **"Create Web Service"**.

### 2. Deploy the Client (Static Site)

1. Go to [dashboard.render.com](https://dashboard.render.com) → **"New"** → **"Static Site"**.
2. Connect the same GitHub repository.
3. Configure:
   - **Name**: `vision-eye-care-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://vision-eye-care-server.onrender.com/api` |
5. Add all Firebase env vars (`VITE_FIREBASE_*`) from your `.env.example`.
6. Under **Redirects/Rewrites**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Click **"Create Static Site"**.

---

## Post-Deployment Checklist

- [ ] Verify the **server health check**: `https://vision-eye-care-server.onrender.com/api/health`
- [ ] Verify the **client** loads at `https://vision-eye-care-client.onrender.com`
- [ ] Confirm **CORS** works — the `CLIENT_URL` env var on the server must match the client's URL exactly
- [ ] Test **authentication** (login/register) end-to-end
- [ ] Test **product listing** and **image uploads** (Cloudinary)

---

## Notes

- **Free tier**: Render's free web services spin down after 15 min of inactivity. The first request after spin-down takes ~30s. Upgrade to a paid plan for always-on.
- **Port**: Render sets the `PORT` environment variable automatically. The server defaults to `10000` which is Render's standard.
- **SPA Routing**: The `_redirects` file in `client/public/` ensures React Router works correctly — all paths rewrite to `index.html`.
- **Auto-Deploy**: By default, Render auto-deploys on every push to the connected branch.
