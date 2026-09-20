# Portofolio Silvia Eklesiana Sitorus

Halaman web portofolio profesional (single page) untuk **Tugas Mandiri Minggu 02** mata kuliah
**Pemrograman dan Pengujian Aplikasi Web (12S3101)**, Program Studi S1 Sistem Informasi,
Institut Teknologi Del.

| | |
|---|---|
| **Live demo** | https://silviasitorus12.github.io/ppw-2026-week2-12S24004/ |
| **Repositori** | https://github.com/SilviaSitorus12/ppw-2026-week2-12S24004 |
| **Dosen pengampu** | Chandro Pardede, S.Kom., M.Sc. |

## Tampilan

| Desktop | Mobile |
|---------|--------|
| <img src="screenshots/desktop.png" alt="Tampilan desktop halaman portofolio" width="560"> | <img src="screenshots/mobile.png" alt="Tampilan mobile halaman portofolio" width="240"> |

## Deskripsi

Halaman ini memperkenalkan profil akademik dan karya saya sebagai mahasiswa Sistem Informasi
yang berfokus pada UI/UX Design, pengembangan perangkat lunak, dan analisis sistem.
Isinya terbagi dalam beberapa bagian:

- **Beranda:** perkenalan singkat, peran, dan foto profil.
- **Tentang saya:** bio, perjalanan akademik, info singkat, organisasi, dan keahlian.
- **Portofolio karya:** lima proyek pilihan (GLOBORA, Imuniku, Labersa Sport Center IS,
  DummyMine, NextStep AI) beserta tabel rekap capaian, sertifikasi, dan publikasi.
- **Layanan:** formulir konsultasi layanan desain dan pengembangan.

## Pemenuhan Spesifikasi Tugas

| Komponen (bobot) | Implementasi |
|---|---|
| **Struktur semantik HTML5 (20%)** | `header`, 2 `nav`, 1 `main`, 6 `section`, `article`, 2 `aside`, `figure`, dan `footer`. Wadah `div` hanya dipakai untuk pengaturan tata letak. |
| **Data tabular dan list (15%)** | Satu tabel semantik lengkap dengan `caption`, `thead`, `tbody`, `tfoot`, dan atribut `scope="col"` / `scope="row"`. Menggunakan tiga jenis list: `ul`, `ol` (perjalanan akademik), dan `dl` (info singkat, keahlian). |
| **Formulir interaktif dan accessible (20%)** | 3 blok `fieldset` dengan `legend`, ditambah 2 kelompok pilihan bersarang. Memuat 9 jenis kontrol: text, email, tel, number, date, radio, checkbox, select, dan textarea. Semua kontrol memiliki `label for`, dan validasi native lewat `required`, `minlength`, `maxlength`, `pattern`, `min`, dan `max`. Teks bantuan dihubungkan dengan `aria-describedby`. |
| **Estetika dan tata letak CSS modern (25%)** | `style.css` eksternal dengan reset `box-sizing: border-box`, palet warna 60-30-10, tipografi modern, `border-radius`, `box-shadow`, tata letak **Flexbox** dan **Grid**, serta responsif melalui `@media (max-width: 768px)`. |
| **Git dan GitHub Pages (20%)** | Repositori publik `ppw-2026-week2-12S24004`, riwayat commit terstruktur, README ini, dan situs live di GitHub Pages. |

## Palet Warna (Aturan 60-30-10)

| Porsi | Peran | Warna |
|-------|-------|-------|
| **60%** | Latar halaman dan kartu | `#fff7fa`, `#ffffff`, `#fdeaf1` |
| **30%** | Teks, header tabel, footer | `#3a1d33`, `#6b4a62` |
| **10%** | Tombol, tautan, lencana | `#be185d`, `#fbd5e5` |

Tipografi memakai **Fraunces** untuk judul dan **Plus Jakarta Sans** untuk teks isi,
keduanya dari Google Fonts.

## Aksesibilitas (WCAG 2.2 AA)

- Tautan *skip link* ke konten utama untuk pengguna keyboard dan pembaca layar.
- Indikator fokus yang jelas pada semua elemen interaktif.
- Kontras teks minimal 4.5:1, dan kontras batas kontrol formulir minimal 3:1.
- Target sentuh minimal 44 px pada tombol, tautan menu, dan pilihan formulir.
- Semua gambar memiliki teks alternatif (`alt`) yang deskriptif.
- Label eksplisit untuk semua kontrol formulir, dan pilihan radio/checkbox ditandai dengan
  warna sekaligus ikon centang, tidak hanya warna.
- Tabel dibungkus area yang bisa digulir dengan keyboard pada layar kecil.
- Menghormati preferensi *reduced motion*: animasi otomatis dinonaktifkan.

## Struktur Folder

```
ppw-2026-week2-12S24004/
├── index.html
├── style.css
├── script.js
├── README.md
├── assets/
│   ├── profile.jpeg
│   ├── globora.png
│   ├── imuniku.png
│   ├── labersa.png
│   ├── dummymine.jpg
│   ├── nextstep.png
│   ├── sertifikat-himiverse.pdf
│   ├── sertifikat-algopython.pdf
│   └── sertifikat-del-english-club.png
└── screenshots/
    ├── desktop.png
    └── mobile.png
```

## Menjalankan di Komputer Lokal

1. Clone atau unduh repositori ini.
2. Buka folder di Visual Studio Code.
3. Klik kanan `index.html`, lalu pilih **Open with Live Server**.

Font dimuat dari Google Fonts, jadi koneksi internet diperlukan agar tipografi tampil sesuai rancangan.

## Deployment

```bash
git init
git add .
git commit -m "feat: complete week 2 html5 and modern css assignment"
git remote add origin https://github.com/SilviaSitorus12/ppw-2026-week2-12S24004.git
git branch -M main
git push -u origin main
```

Setelah itu aktifkan **Settings → Pages → Branch: `main` → Save**. Situs akan aktif di
tautan *live demo* di atas dalam 1 sampai 2 menit.

## Catatan

- Formulir konsultasi bersifat **simulasi**. GitHub Pages hanya menyajikan berkas statis,
  jadi `script.js` menampilkan pesan konfirmasi setelah validasi lolos, dan data tidak
  dikirim ke server.
- `script.js` juga menandai menu yang aktif sesuai bagian yang sedang dibaca dan memberi
  bayangan tipis pada header saat halaman digulir.

## Teknologi

HTML5, CSS3 (Flexbox, Grid, custom properties, `clamp()`, `position: sticky`),
JavaScript dasar, Git, dan GitHub Pages. Ikon berupa SVG inline.

## Pembuat

**Silvia Eklesiana Sitorus**, S1 Sistem Informasi, Institut Teknologi Del.
[GitHub](https://github.com/SilviaSitorus12) ·
[LinkedIn](https://www.linkedin.com/in/silvia-sitorus)