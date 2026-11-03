# Indi Labs — AI-Powered Faceless Content Studio

> **Platform Otomatisasi Konten Video Tanpa Wajah Berbasis AI dengan Fokus Monetisasi AdSense High-RPM Multi-Pasar.**

Indi Labs dirancang khusus untuk operator studio konten *faceless* yang menargetkan pasar dengan CPM dan RPM pengiklan tertinggi di dunia: **Amerika Serikat (USA)**, **Inggris Raya (UK)**, **Kanada (CA)**, **Australia (AU)**, **Jepang (JP)**, dan **Teluk Arab (Arab Gulf / GCC)**.

Aplikasi ini mengusung estetika **Swiss Performance Dark Theme** dengan tipografi presisi **Outfit** (display judul), **DM Sans** (body text), dan **JetBrains Mono** (metrik & data angka tabular), serta menerapkan prinsip *Zero-Pill Discipline* dan arsitektur tanpa *AI slop*.

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [6 Alur Kerja Studio (Core Workflows)](#6-alur-kerja-studio-core-workflows)
- [Validasi Platform & Regex URL](#validasi-platform--regex-url)
- [Autentikasi & Keamanan Data (Firebase)](#autentikasi--keamanan-data-firebase)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Cara Instalasi & Menjalankan Proyek](#cara-instalasi--menjalankan-proyek)
- [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
- [Panduan Penggunaan (Workflow Guide)](#panduan-penggunaan-workflow-guide)
- [Lisensi](#lisensi)

---

## Fitur Utama

- 🌍 **Portofolio Saluran Multi-Negara**: Kelola saluran konten dalam berbagai mata uang (USD, GBP, CAD, AUD, JPY, AED/SAR) dengan estimasi RPM $12 – $48 per 1.000 views.
- 🎯 **Radar Niche High-RPM**: Analisis pasar dan penawaran pengiklan institusional (FinTech, SaaS B2B, Luxury Real Estate, Clean Tech, Longevity, Wealth).
- ✍️ **Studio Naskah & Storyboard**: Formula retensi penonton berbasis psikologi (*0-3s Hook, Agitasi, Fakta Asimetris, CTA Konversi Tinggi*) bertenaga AI Gemini.
- 🎙️ **Studio Sulih Suara Alami Multi-Bahasa**: Sintesis vokal berkarakter (Bahasa Indonesia, US Executive, UK BBC, Tokyo Explainer, Khaleeji) dengan visualizer spektrum audio langsung dan marker intonasi naskah.
- ⚙️ **Batch Pipeline 6-Tahap dengan Batas Kuota 5 Video/Hari**: Sistem perakitan video otomatis dengan pengaman kuota harian ketat untuk mencegah sanksi deteksi spam algoritma platform.
- 📅 **Penjadwal Multi-Platform Otomatis**: Penjadwalan cerdas ke YouTube, Instagram Reels, Facebook Reels, dan TikTok pada jam tayang puncak (*Prime Viewing Hours*) masing-masing zona waktu.
- 🔗 **Dropdown Platform & Validasi Regex**: Dropdown 4 opsi pasti (YouTube, Facebook, Instagram, TikTok) dengan placeholder dinamis dan validasi Regex domain resmi.
- 🔐 **Autentikasi & Sinkronisasi Cloud**: Login instan dengan Google OAuth Popup & Email/Password, serta penyimpanan profil aman di Cloud Firestore.
- 🇮🇩 **Dukungan Bilingual Penuh**: Bahasa Indonesia sebagai default dan English, dapat diganti secara instan di navigasi atas.

---

## 6 Alur Kerja Studio (Core Workflows)

### 1. Hub Saluran (Channel Hub)
- **Ringkasan Portofolio**: Memantau total estimasi pendapatan bulanan (*Monthly Revenue*), rata-rata RPM gabungan (*Blended RPM*), jumlah pelanggan aktif, dan video dalam antrean.
- **Filter Pasar Geografis**: Filter cepat berdasarkan negara target (USA, UK, CA, AU, JP, Arab Gulf).
- **Manajemen Saluran**: Beralih saluran aktif atau daftarkan saluran baru melalui modal pendaftaran dengan validasi input.

### 2. Radar Niche RPM (Niche Radar)
- **Matriks Data Riil**: Tabel komparatif nilai RPM AdSense, estimasi CPM, volume pencarian, dan tingkat persaingan per negara.
- **Filter Fleksibel**: Slider batas minimal RPM ($20 - $45) dan filter tingkat kompetisi (*Low, Medium, High*).
- **AI Deep-Dive Blueprint**: Mengidentifikasi pengiklan pembayar terbesar (*Peak Paying Advertisers*), celah konten yang belum terpenuhi (*Content Gaps*), dan protokol retensi penonton.
- **One-Click Hand-off**: Tombol *"Buat Naskah dari Niche Ini"* yang langsung memuat topik terpilih ke Studio Naskah.

### 3. Studio Naskah & Storyboard (Script & Storyboard Studio)
- **Generator Naskah AI**: Didukung API proxy Gemini AI (`gemini-2.5-flash`) dengan parameter topik, gaya bahasa, format video (Shorts 9:16 atau 16:9), dan estimasi RPM.
- **Arsitektur Retensi Viral**:
  - *Detik 0–3*: Pattern Interrupt Hook (Target APV >80%).
  - *Detik 3–15*: Agitasi masalah & celah keingintahuan (*Curiosity Gap*).
  - *Detik 15–50*: Daging informasi asimetris bernilai tinggi.
  - *Detik 50–60*: Call to Action (CTA) konversi tinggi.
- **Editor Storyboard Visual**: Setiap adegan dilengkapi durasi, visual prompt untuk AI generator (Midjourney / Runway / Kling / Flux), teks sulih suara, efek suara (SFX), dan aksi kamera/B-Roll.
- **Mode Teleprompter**: Tampilan layar penuh untuk meninjau naskah dengan penghitung kata dan estimasi durasi bicara.
- **Push to Pipeline**: Mengirim naskah yang telah selesai langsung ke antrean produksi batch.

### 4. Sulih Suara AI (Natural Voiceover Studio)
- **Karakter Vokal Multi-Bahasa**:
  - *Arya*: Bahasa Indonesia (Dubbing Dokumenter Formal).
  - *Sari*: Bahasa Indonesia (Investigatif Dinamis).
  - *Marcus*: English US (Wall Street Executive).
  - *Alistair*: English UK (BBC Broadcast Documentary).
  - *Kenji*: Japanese (Tokyo Tech Explainer).
  - *Tariq*: Arabic Gulf (Khaleeji Resonant).
- **Web Speech Synthesis**: Uji coba suara langsung di browser dengan kontrol kecepatan tempo (*0.8x – 1.4x*), *pitch*, dan volume master.
- **Visualizer Spektrum Audio**: Gelombang audio interaktif pada kanvas HTML5 saat suara diputar.
- **Marker Intonasi Naskah**: Tombol cepat untuk menyisipkan tanda ekspresi: `[pause: 400ms]`, `[whisper]`, `[authoritative]`, dan `[emphasis]`.
- **Audio Ducking**: Pengurangan volume instrumen latar (-18dB di bawah vokal) dan *master limiter* (-0.5dB true peak).

### 5. Batch Pipeline 6-Tahap (6-Stage Production Pipeline)
- **Batas Kuota Harian Ketat (5 Video/Hari)**:
  - Batas harian visual (`3 / 5 Video Hari Ini`).
  - *Countdown timer* reset otomatis pukul 00:00 UTC.
  - Penguncian protektif (*Lock Protection*) ketika kuota tercapai guna menjaga reputasi channel dari filter spam YouTube dan TikTok.
- **6 Tahap Perakitan Konten**:
  1. *Tahap 1*: Penguncian Naskah & Storyboard.
  2. *Tahap 2*: Mastering Sulih Suara & Desain Suara (48kHz / -14 LUFS).
  3. *Tahap 3*: Generasi Visual AI & Sinkronisasi B-Roll 4K.
  4. *Tahap 4*: Pembuatan Subtitle Kinetik Dinamis dengan kata penekanan warna kuning.
  5. *Tahap 5*: Render Video 60fps dengan Swiss LUT Color Grading.
  6. *Tahap 6*: Pemeriksaan Mutu (QA) & Pembuatan Paket Thumbnail High-CTR.
- **Simulasi Batch Interaktif**: Tombol *"Jalankan Batch Produksi"* dengan progres live (0% -> 100%), catatan log terminal, dan pemutar preview video.

### 6. Penjadwal Multi-Platform (Multi-Platform Scheduler)
- **Sinkronisasi Prime-Time**: Jadwal otomatis berdasarkan jam aktif penonton di negara sasaran (contoh: USA 17:00–21:00 EST, UK 18:00–21:30 GMT, Arab Gulf 20:00–23:30 GST, Tokyo 19:00–22:00 JST).
- **Ekspor Kalender (.ics)**: Unduh berkas jadwal kalender iCalendar standar untuk disinkronkan ke Google Calendar, Apple Calendar, atau Outlook.

---

## Validasi Platform & Regex URL

Sistem penjadwalan dan profil saluran dilengkapi validasi URL ketat pada sisi klien:
1. **Dropdown Platform**: Memilih 1 dari 4 platform: `YouTube`, `Facebook`, `Instagram`, atau `TikTok`.
2. **Placeholder Dinamis**:
   - YouTube: `https://youtube.com`
   - Instagram: `https://instagram.com`
   - TikTok: `https://tiktok.com`
   - Facebook: `https://facebook.com`
3. **Validasi Regex Domain**:
   - **YouTube**: `/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*(youtube\.com|youtu\.be)(\/.*)?$/i`
   - **Instagram**: `/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*instagram\.com(\/.*)?$/i`
   - **TikTok**: `/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*tiktok\.com(\/.*)?$/i`
   - **Facebook**: `/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*(facebook\.com|fb\.watch|fb\.com)(\/.*)?$/i`
4. **Indikator Status Real-Time**: Border input menyala hijau dengan ikon centang jika URL valid, dan menyala merah dengan pesan peringatan bila domain tidak sesuai.

---

## Autentikasi & Keamanan Data (Firebase)

- **Firebase Authentication**:
  - Login 1-klik menggunakan **Google OAuth Popup** (`signInWithPopup`).
  - Pendaftaran dan masuk menggunakan **Email & Password** dengan validasi formulir dan tombol toggle lihat sandi.
- **Cloud Firestore**:
  - Profil pengguna tersimpan di koleksi `/users/{userId}`.
  - Terlindungi oleh aturan keamanan ketat (`firestore.rules`) berbasis *Attribute-Based Access Control* (ABAC).
  - Aturan *default-deny* dan hanya memperbolehkan akses baca/tulis oleh pemilik sah akun (`isOwner(userId)`).

---

## Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite 8, esbuild |
| **Styling & Theme** | Tailwind CSS v4, Swiss Dark Palette (`#090d16`) |
| **Typography** | Outfit (Headings), DM Sans (Body), JetBrains Mono (Metrics) |
| **Icons & Motion** | Lucide React, Motion |
| **Full-Stack Server** | Node.js, Express, tsx |
| **AI SDK** | `@google/genai` (Google Gemini API — model `gemini-2.5-flash`) |
| **Database & Auth** | Firebase Authentication, Google Cloud Firestore |

---

## Struktur Proyek

```text
├── index.html                       # HTML entry point dengan font Outfit & DM Sans
├── metadata.json                    # Metadata aplikasi AI Studio
├── package.json                     # Konfigurasi dependensi dan scripts
├── tsconfig.json                    # Konfigurasi TypeScript
├── vite.config.ts                   # Konfigurasi bundler Vite
├── server.ts                        # Server Express full-stack & proxy API AI Gemini
├── firestore.rules                  # Aturan keamanan Cloud Firestore (ABAC)
├── firebase-blueprint.json          # Intermediate schema blueprint database
├── firebase-applet-config.json      # Konfigurasi kredensial Firebase App
├── src/
│   ├── main.tsx                     # Entry point React DOM
│   ├── App.tsx                      # Root component, state manajemen & routing alur kerja
│   ├── index.css                    # Definisi Tailwind CSS v4 & custom scrollbar
│   ├── types.ts                     # Definisi tipe TypeScript lengkap
│   ├── i18n.ts                      # Kamus bilingual (Bahasa Indonesia & English)
│   ├── lib/
│   │   └── firebase.ts              # Inisialisasi Firebase Auth & Firestore client
│   ├── utils/
│   │   └── platformValidation.ts    # Validasi Regex domain & placeholder dinamis
│   ├── constants/
│   │   └── initialData.ts           # Dataset awal saluran, niche, vokal & batch video
│   ├── assets/
│   │   └── images/                  # Aset gambar sinematik berkualitas tinggi
│   └── components/
│       ├── TopBar.tsx               # Header contract 3-zona (Brand, Meta, Quota/Auth/Lang)
│       ├── Sidebar.tsx              # Navigasi desktop & widget kuota harian 5 video
│       ├── MobileNav.tsx            # Navigasi bottom bar & drawer slide-over mobile
│       ├── ChannelHub.tsx           # Workflow 1: Portofolio saluran multi-negara
│       ├── NicheRadar.tsx           # Workflow 2: Radar niche AdSense RPM tinggi
│       ├── ScriptStudio.tsx         # Workflow 3: Studio naskah AI & storyboard visual
│       ├── VoiceoverStudio.tsx      # Workflow 4: Studio sulih suara alami Web Speech
│       ├── BatchPipeline.tsx        # Workflow 5: Pipeline 6-tahap & kuota limiter
│       ├── PlatformScheduler.tsx    # Workflow 6: Penjadwal multi-platform & regex validator
│       ├── VideoPreviewModal.tsx    # Modal pemutar video dengan subtitle kinetik
│       └── AuthModal.tsx            # Modal login Google popup & email/password
```

---

## Persyaratan Sistem

- **Node.js**: Versi 20.x atau lebih baru.
- **Paket Manajer**: `npm`, `yarn`, atau `bun`.
- **Browser Modern**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari (mendukung fitur Web Speech API dan Canvas rendering).

---

## Cara Instalasi & Menjalankan Proyek

### 1. Clone Repositori
```bash
git clone <URL_REPOSITORI_ANDA>
cd indi-labs
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas template lingkungan:
```bash
cp .env.example .env
```
Isi kunci API Gemini pada berkas `.env`:
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```
*(Di lingkungan Google AI Studio, `GEMINI_API_KEY` akan diinjeksi secara otomatis dari user secrets).*

### 4. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Aplikasi akan aktif dan dapat diakses di:
```text
http://localhost:3000
```

### 5. Pemeriksaan Tipe & Linting
Untuk memeriksa kesesuaian TypeScript:
```bash
npm run lint
```

### 6. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di direktori `dist/`.

---

## Panduan Penggunaan (Workflow Guide)

Berikut adalah siklus standar memproduksi video faceless bernilai RPM tinggi menggunakan Indi Labs:

1. **Pilih Saluran Aktif di Hub Saluran**:
   - Masuk ke tab **Hub Saluran** (*Channel Hub*).
   - Pilih saluran yang ditargetkan (contoh: *Apex Capital Files* untuk pasar AS atau *Khaleeji Horizon* untuk Teluk Arab).
2. **Analisis Niche di Radar RPM**:
   - Buka tab **Radar Niche RPM**.
   - Tinjau metrik RPM tertinggi, lalu klik **Deep-Dive** untuk melihat pengiklan pembayar tertinggi dan celah konten.
   - Klik **"Buat Naskah dari Niche Ini"** untuk memuat topik ke studio penulisan.
3. **Generate & Modifikasi Naskah di Studio Naskah**:
   - Sesuaikan topik, nada bicara (*Authoritative Swiss Documentary*), dan format video (Shorts 9:16).
   - Klik **"Hasilkan Naskah AI"** untuk membuat naskah dan kartu storyboard per adegan.
   - Buka **Mode Pembaca Teleprompter** untuk memeriksa aliran kalimat.
   - Klik **"Kirim ke Batch Pipeline"**.
4. **Uji Coba Sulih Suara di Studio Suara**:
   - Masuk ke tab **Sulih Suara AI**.
   - Pilih karakter vokal yang sesuai dengan target bahasa penonton.
   - Sesuaikan tempo bicara (*Rate*) dan sisipkan penanda intonasi seperti `[pause: 400ms]` atau `[authoritative]`.
   - Putar untuk mendengarkan hasil sintesis dan amati visualizer spektrum audio.
5. **Jalankan Manufaktur di Batch Pipeline**:
   - Masuk ke tab **Batch Pipeline 6-Tahap**.
   - Amati penggunaan kuota harian Anda (maksimal 5 video/hari).
   - Klik **"Jalankan Batch Produksi"** untuk memulai perakitan otomatis dari Tahap 1 hingga Tahap 6.
   - Klik **"Pratinjau Hasil Video"** untuk melihat simulasi hasil video lengkap dengan teks kinetik dinamis kuning.
6. **Jadwalkan Unggahan di Penjadwal Multi-Platform**:
   - Buka tab **Penjadwal Multi-Platform**.
   - Klik **"Jadwalkan Unggahan Baru"**.
   - Pilih platform target dari dropdown (YouTube, Facebook, Instagram, atau TikTok).
   - Masukkan URL target dan pastikan lolos validasi Regex.
   - Tentukan tanggal & waktu rilis sesuai jam puncak penonton (*Prime Time*).
   - Unduh kalender `.ics` untuk sinkronisasi jadwal studio Anda.

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi **Apache-2.0**.
