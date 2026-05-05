# FinPilot Lite 🚀

> A full-stack personal finance dashboard to track your portfolio, simulate trades, and view market insights — built with Node.js, Express, Supabase, and vanilla JS.

Working demo:- https://www.loom.com/share/611f8c5a6f5c42a785b5ff77d0e5ea55
---

## 📁 Project Structure

```
finpilot-lite/
├── frontend/
│   └── index.html        # Single-page dashboard (HTML + CSS + JS)
├── backend/
│   ├── server.js         # Express API server
│   ├── package.json
│   ├── .env.example      # Environment variable template
│   └── .gitignore
└── README.md
```

---

## ⚙️ Setup

### 1. Supabase Database

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run:

```sql
-- Portfolio table
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  asset TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  buy_price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  asset TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Go to **Project Settings → API** and copy your **Project URL** and **anon/public key**.

### 2. Backend

```bash
cd backend

# Install dependencies
npm install

# Copy and fill in your environment variables
cp .env.example .env
# Edit .env with your SUPABASE_URL and SUPABASE_KEY

# Start the server
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Frontend

Open `frontend/index.html` directly in your browser.

> **Note:** The frontend makes requests to `http://localhost:3000/api`. If you deploy the backend separately, update the `API` constant at the top of the `<script>` block in `index.html`.

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/prices` | Returns mock market prices |
| GET | `/api/portfolio` | List all portfolio holdings |
| POST | `/api/portfolio` | Add a holding `{ asset, quantity, buy_price }` |
| DELETE | `/api/portfolio/:id` | Remove a holding |
| GET | `/api/trades` | List all trades |
| POST | `/api/trade` | Record a trade `{ asset, type, quantity, price }` |

---

## ☁️ Deployment

### Backend → Render

1. Push your project to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your repo, set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables: `SUPABASE_URL`, `SUPABASE_KEY`, `PORT=3000`.
7. Deploy. Copy the public URL (e.g. `https://finpilot-lite.onrender.com`).
8. Update the `API` constant in `frontend/index.html` to point to this URL.

### Frontend → Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → **Create application → Pages**.
2. Connect your GitHub repo.
3. Set **Root directory** to `frontend`.
4. Set **Build command** to *(leave blank)*.
5. Set **Build output directory** to `/frontend` or `.` (since it's a static file).
6. Deploy. Cloudflare will give you a public URL for your dashboard.

---

## 📈 Features

- **Dashboard** — Live mock prices for BTC, ETH, AAPL, TSLA, RELIANCE, INFY with % change indicators
- **Portfolio** — Add/delete holdings, see current value & P&L calculated against live prices
- **Trade Simulator** — Log buy/sell trades with timestamps
- **Insights** — Total invested, current portfolio value, donut chart allocation, top performer

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (dark theme), Vanilla JS, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
