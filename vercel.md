# Portfosin FE

Frontend dashboard admin + landing page portofolio personal. Vue 3, TypeScript, Tailwind v4.

## Prasyarat

- Node.js 18+
- npm

## Persiapan

```bash
npm install
cp .env.example .env   # atau buat manual
```

Isi `.env`:

| Variable | Wajib | Default |
|----------|-------|---------|
| `VITE_API_BASE_URL` | Ya | `https://portfosin.vercel.app/api/v1` |

## Development

```bash
npm run dev        # http://localhost:3000
npm run typecheck  # vue-tsc --noEmit
npm run test:unit  # Vitest
```

## Build

```bash
npm run build        # output ke dist/
npm run preview      # preview build lokal
```

## Deploy ke Vercel

### Opsi 1 — Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Opsi 2 — Via Git (Vercel Dashboard)

1. Push repo ke GitHub/GitLab/Bitbucket
2. Buka [vercel.com](https://vercel.com) → **Add New Project**
3. Import repo → **Framework Preset: Vite**
4. Set environment variable:
   - `VITE_API_BASE_URL` → `https://portfosin.vercel.app/api/v1`
5. **Root Directory:** `./` (default)
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Klik **Deploy**

### Konfigurasi Vercel (vercel.json)

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> `rewrites` penting untuk SPA — semua route diarahkan ke `index.html` agar Vue Router bisa handle routing client-side.

### Custom Domain

Di dashboard Vercel → project → **Domains** → tambah domain. Vercel otomatis setup SSL.

## API

Semua request ke `/api/*` di-proxy oleh Vite dev server ke `http://localhost:8000`. Di production (Vercel), request langsung ke `VITE_API_BASE_URL`.

## Struktur

```
src/
├── app/            App.vue, main.ts, router
├── api/            Axios client + endpoint files
├── features/       auth, landing, dashboard, projects, techs
├── components/     ui, form, cards, layout, modal
├── stores/         theme, locale (Pinia)
├── styles/         main.css (Tailwind v4)
├── utils/          cn, format
├── types/          QueryParams
├── constants/
└── shared/locales/ en.json, id.json
```

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Dev server port 3000 |
| `npm run build` | Build production |
| `npm run typecheck` | Vue TypeScript check |
| `npm run test:unit` | Vitest |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
