# Kuliah Islam Abu Dzar — Website Pendaftaran

Website satu halaman (one-page) untuk pendaftaran mahasiswa baru **Kuliah Islam Abu Dzar (KITA)**, semester **Genap 2026/2027**. Dibangun dengan React 19, Vite, dan Tailwind CSS v4.

## Menjalankan proyek

```bash
npm install
npm run dev        # server pengembangan
npm run build      # build produksi ke dist/
npm run preview    # pratinjau hasil build
```

> Di Windows, gunakan `npm.cmd` bila PowerShell memblokir `npm.ps1`.

## Perintah aset

```bash
npm run assets     # optimasi WebP, favicon, OG image, logo publik
npm run pdf        # buat flyer PDF A4 dari flyer PNG
```

Keluaran aset:

| Berkas | Keterangan |
| --- | --- |
| `src/assets/hero-person.webp` | Cutout foto hero (cadangan, transparan) |
| `src/assets/hero-backdrop.webp` | Latar hero |
| `src/assets/flyer-thumb.webp` | Pratinjau flyer untuk kartu biaya |
| `src/assets/logo-kita-optimized.png` | Logo teroptimasi untuk header/footer |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Ikon situs |
| `public/og-image.jpg` | Gambar Open Graph 1200×630 |
| `public/logo-kita.png` | Logo untuk JSON-LD |
| `public/flyer-pendaftaran-kuliah-islam-abu-dzar-genap-2026-2027.pdf` | Flyer PDF A4 |

## Konfigurasi

Semua data utama ada di `src/data/`:

- `site.js` — nama, kontak, alamat, rekening, URL formulir eksternal, analytics, navigasi.
- `programs.js` — data prodi PAI & PGMI (deskripsi, gelar, highlight, kurikulum).
- `lecturers.js` — profil dosen (foto/almamater masih `null`).
- `faq.js` — daftar pertanyaan dan jawaban.
- `academic.js` — kalender akademik; nilai `null` tampil sebagai “Segera diumumkan”.
- `testimonials.js` — kosong; section testimoni otomatis disembunyikan.

### Variabel lingkungan (opsional)

Buat file `.env` bila diperlukan:

```env
VITE_SITE_URL=https://kampuskita.id
VITE_REGISTRATION_URL=
VITE_GA4_ID=
VITE_META_PIXEL_ID=
```

- `VITE_REGISTRATION_URL` — bila diisi, tombol daftar membuka formulir eksternal (mis. Formfacade/Google Form) alih-alih drawer lokal.
- `VITE_GA4_ID` / `VITE_META_PIXEL_ID` — analytics hanya dimuat bila diisi.

## Alur pendaftaran

1. Pengunjung memilih prodi PAI atau PGMI.
2. Formulir lokal mengumpulkan nama, WhatsApp, email (opsional), pendidikan, pekerjaan, domisili.
3. Saat dikirim, WhatsApp terbuka dengan pesan pendaftaran yang sudah terisi.
4. Peserta transfer **Rp550.000** ke **BSI 7014991788 a/n Yayasan Abu Dzar**, lalu mengirim bukti.
5. Tim admisi memverifikasi dan mengirim informasi perkuliahan.

QR code mengarah ke `#daftar` pada domain tempat situs dipasang, atau ke `VITE_REGISTRATION_URL` bila diisi.

## Struktur halaman

Urutan section mengikuti wireframe desktop:

1. Hero — “Kuliah Islam Terbuka untuk Semua Kalangan.”
2. Program Studi — S1 PAI, S1 PGMI (badge “Prodi Baru”).
3. Sistem Kuliah & Legalitas — online Google Meet/Classroom, akhir pekan, PDDIKTI, Kurikulum OBE.
4. Biaya — Pendaftaran Rp550.000, Uang Masuk GRATIS, UKT Rp1.950.000/semester.
5. Cara Daftar — 4 langkah, QR, rekening resmi.
6. Dosen — 6 profil, tanpa logo universitas.
7. Akademik — kalender semester genap 2026/2027.
8. Testimoni — hanya tampil bila data tersedia.
9. FAQ.
10. CTA pendaftaran.
11. Kontak & footer — peta, alamat, WhatsApp, email, Instagram, YouTube.

## Catatan konten yang menunggu data

Bagian berikut sengaja dibuat sebagai placeholder dan tidak mengarang klaim:

- Tanggal PBAK, awal kuliah, UTS, UAS, dan libur.
- Nama kampus induk.
- Struktur kurikulum PAI/PGMI.
- Foto dan almamater dosen.
- Testimoni mahasiswa/alumni.

Setelah data tersedia, cukup isi berkas di `src/data/` dan ganti nilai `null`/array kosong.

## SEO & aksesibilitas

- Title, meta description, canonical, Open Graph, Twitter Card, dan JSON-LD (`CollegeOrUniversity`).
- `google-site-verification` disediakan di `index.html` untuk diisi kode GSC.
- Semua gambar memiliki alt text (atau `alt=""` untuk dekoratif).
- Navigasi keyboard, skip link, focus ring, `aria-expanded` pada FAQ/menu, focus trap pada modal.
- Menghormati `prefers-reduced-motion`.

## Teknis

- Tanpa router; navigasi memakai anchor. `#daftar` membuka drawer pendaftaran.
- Font Plus Jakarta Sans di-self-host melalui `@fontsource-variable/plus-jakarta-sans`.
- Ikon dari `lucide-react`; QR dari `qrcode.react`.
- PDF dibuat dengan `pdf-lib`, gambar dioptimasi dengan `sharp`.
