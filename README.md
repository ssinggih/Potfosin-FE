# Portfosin

Portofolio personal. Built with Vue 3, TypeScript, Tailwind CSS v4.

## Fitur

- Landing page dengan project, tech stack, contact
- Dashboard admin (Overview, Projects, Techs, Images)
- CRUD project + tech
- Dark/light mode
- Bahasa Indonesia / English

## Install

```bash
git clone https://github.com/username/portfosin-FE.git
cd portfosin-FE
npm install
```

## Konfigurasi

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=https://portfosin.vercel.app/api/v1
```

## Jalankan

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Build

```bash
npm run build
```

Hasil build di folder `dist/`.

## Tech Stack

| Teknologi          | Untuk            |
| ------------------ | ---------------- |
| Vue 3              | UI framework     |
| TypeScript         | Type safety      |
| Vite               | Build tool       |
| Tailwind CSS v4    | Styling          |
| Pinia              | State management |
| TanStack Vue Query | Server state     |
| Axios              | HTTP client      |
| Zod + VeeValidate  | Form validation  |
| vue-i18n           | Multi bahasa     |
| Vitest             | Unit test        |
