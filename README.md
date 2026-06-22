# Marketplace Frontend

Frontend PWA untuk Marketplace Laravel 13, dibangun dengan Vue 3 + Vite.

## Tech Stack

- **Vue 3** — Composition API + `<script setup>`
- **Vite** — Build tool
- **Pinia** — State management
- **Vue Router** — Routing
- **Axios** — HTTP client
- **vite-plugin-pwa** — Progressive Web App

## Fonts

- DM Sans (body)
- General Sans (heading/display)
- JetBrains Mono (price)

## Persyaratan

- Docker & Docker Compose
- Node.js 18+ (development)

## Cara Menjalankan

### Production (Docker)

```bash
docker compose up -d --build
```

Akses di **http://localhost:3003**.

### Development

```bash
npm install
npm run dev
```

Akses di **http://localhost:3003**.

## Build

```bash
npm run build
```

Hasil build di folder `dist/`.

## API

Backend: [Marketplace Laravel 13](http://localhost)

| Endpoint | Method | Auth | Keterangan |
|----------|--------|------|------------|
| `/api/v1/products` | GET | - | List produk |
| `/api/v1/products/{id}` | GET | - | Detail produk |
| `/api/v1/categories` | GET | - | List kategori |
| `/api/v1/auth/login` | POST | - | Login |
| `/api/v1/auth/me` | GET | Bearer | Profil user |
| `/api/v1/auth/logout` | POST | Bearer | Logout |
| `/api/v1/cart` | GET/POST | Bearer | Keranjang |
| `/api/v1/cart/{id}` | PATCH/DELETE | Bearer | Update/hapus item |
| `/api/v1/cart/checkout` | POST | Bearer | Checkout |
| `/api/v1/transactions` | GET | Bearer | Riwayat transaksi |

## Environment

Salin `.env.example` ke `.env`:

```
VITE_API_URL=http://localhost
```

## Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `password` |
| Customer | `customer@example.com` | `password` |

## Struktur

```
src/
├── components/    # UI components
│   ├── MnButton.vue
│   ├── MnCard.vue
│   ├── MnInput.vue
│   └── ProductCard.vue
├── pages/
│   ├── Dashboard.vue    # Marketplace utama
│   └── Login.vue
├── router/
│   └── index.js
├── services/
│   └── api.js           # Axios instance + API functions
├── store/
│   └── auth.js          # Pinia auth store
├── sw.js                # Service worker
├── App.vue
└── main.js
```

## PWA

- Manifest: `manifest.webmanifest`
- Service worker: `sw.js` (precache + runtime caching)
- Ikon: `public/icons/`
- Auto-update service worker
