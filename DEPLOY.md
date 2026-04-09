# 🚀 ArcticFresh Deployment Guide (Render)

Follow these exact steps to launch your platform.

## 1. Create the Backend (Web Service)
- **Repo**: Your GitHub Repository
- **Name**: `arcticfresh-backend`
- **Root Directory**: `server`
- **Language**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`

### 🔑 Backend Env Variables
| Key | Value |
| :--- | :--- |
| `DATABASE_URL` | *Your Supabase Connection String* |
| `RAZORPAY_KEY_ID` | *Your Razorpay Key* |
| `RAZORPAY_KEY_SECRET` | *Your Razorpay Secret* |
| `CLIENT_URL` | *Your Frontend URL (Add this after Step 2)* |
| `PORT` | `3001` |

---

## 2. Create the Frontend (Static Site)
- **Repo**: Your GitHub Repository
- **Name**: `arcticfresh-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### 🔑 Frontend Env Variables
| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | *Your Supabase URL* |
| `VITE_SUPABASE_ANON_KEY` | *Your Supabase Key* |
| `VITE_RAZORPAY_KEY_ID` | *Your Razorpay Key* |
| `VITE_API_BASE_URL` | *Copy your Backend URL from Step 1* |

---

## 3. Security Check
Once both are live, go back to the **Backend Settings** and update the `CLIENT_URL` variable with the real URL Render gave you for the frontend.
