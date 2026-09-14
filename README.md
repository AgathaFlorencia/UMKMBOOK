# UMKMBook

Aplikasi pencatatan keuangan super simpel untuk pemilik usaha mikro (warung, laundry, reseller kecil).

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Database & Auth:** Supabase
- **Deploy:** Vercel

## Cara Menjalankan di Lokal

1. Clone repo ini
2. Install dependencies:
   ```
   npm install
   ```
3. Salin `.env.local.example` jadi `.env.local`, lalu isi dengan kunci Supabase kamu (lihat komentar di dalam file itu untuk caranya)
4. Jalankan:
   ```
   npm run dev
   ```
5. Buka `http://localhost:3000`

### `app/` — Semua halaman website (Frontend + Routing)

Di Next.js, **tiap folder di dalam `app/` otomatis jadi satu halaman** dengan URL sesuai nama foldernya. Gak perlu setting router terpisah kayak di React biasa — ini yang disebut **App Router**.

### `components/` — Potongan UI yang dipakai berulang

Isinya bukan halaman utuh, tapi "potongan" tampilan yang dipasang **di dalam** banyak halaman. Contoh: `Navbar.tsx` (menu navigasi yang muncul di semua halaman, dipasang sekali di `layout.tsx`).

Bedanya sama `app/`: `app/` = halaman (punya URL sendiri), `components/` = bagian kecil yang dipakai di dalam halaman-halaman itu.

### `lib/` — Ini yang berperan sebagai "Backend" (koneksi ke database)

Karena Next.js itu **full-stack** (satu project buat frontend DAN backend sekaligus), gak ada folder terpisah namanya "backend/". Sebagai gantinya:

- **`lib/supabase-client.ts`** — koneksi ke database, dipakai di kode yang jalan di **browser** (misal: waktu user klik tombol submit form). Ditandai `"use client"` di file yang makai ini.
- **`lib/supabase-server.ts`** — koneksi ke database, dipakai di kode yang jalan di **server** (misal: ambil data sebelum halaman ditampilkan ke user). Ini yang lebih sering dipakai di halaman-halaman kayak Dashboard, Riwayat, Laporan.
- **`middleware.ts`** (di root folder) — jalan otomatis di SETIAP request, tugasnya jagain supaya session login user tetap aktif.

Jadi kalau ditanya "mana bagian backend-nya?" — jawabannya: **gak ada folder backend terpisah**, karena Supabase yang jadi backend/database-nya, dan `lib/` adalah folder yang menjembatani kode kita ke Supabase itu.

### File-file penting lain

- **`.env.local`** (harus dibuat sendiri, lihat `.env.local.example`) — tempat naruh kunci rahasia Supabase. **Jangan pernah di-commit ke Git.**
- **`app/globals.css`** — styling global (dipakai Tailwind CSS)
- **`package.json`** — daftar semua library yang dipakai project ini