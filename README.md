## Profil Kinerja Jaringan (DevTools)

### Lingkungan Pengujian

| Parameter | Nilai |
|---|---|
| Browser | Microsoft Edge – DevTools tab Network |
| URL | https://silviasitorus12.github.io/ppw-2026-week2-12S24004/ |
| Emulasi perangkat | Responsive 371 × 848 px |
| Throttling | No throttling |
| Tanggal pengujian | 29 September 2026 |
| Posisi halaman | Paling atas (tanpa scroll) |

**Metode:**
- **Cold Load**: opsi *Disable cache* aktif, lalu *hard reload* (`Ctrl + Shift + R`). Semua berkas diunduh ulang dari server.
- **Warm Load**: opsi *Disable cache* nonaktif, lalu *reload* biasa (`F5`). Browser memakai cache yang sudah tersimpan.

### Tabel Perbandingan Cold Load vs Warm Load

| Metrik | Cold Load | Warm Load | Perubahan |
|---|---|---|---|
| Jumlah request | 18 | 18 | Sama |
| Data ditransfer | 431 kB | 135 B | Turun ± 99,97% |
| Total ukuran resource | 804 kB | 804 kB | Sama |
| TTFB dokumen HTML | 512,30 ms | 31,15 ms | Turun ± 93,9% |
| DOMContentLoaded | 1,51 s | 121 ms | Turun ± 92,0% |
| Load | 1,52 s | 124 ms | Turun ± 91,8% |
| Finish | 1,85 s | 124 ms | Turun ± 93,3% |
| Status dokumen utama | 200 OK (7,7 kB) | 304 Not Modified (135 B) | Body tidak dikirim ulang |
| Sumber CSS, JS, font, gambar | Jaringan | *memory cache* | Tanpa request ke server |
| Sumber data JSON | Jaringan | *disk cache* | Tanpa request ke server |

### Analisis HTTP Caching (RFC 9111)

Response header dokumen utama saat Warm Load:

| Header | Nilai | Makna |
|---|---|---|
| `Cache-Control` | `max-age=600` | Salinan lokal dianggap segar selama 600 detik (10 menit) |
| `ETag` | `W/"6abb7ed7-6a89"` | Sidik jari versi berkas, dipakai untuk validasi |
| `Via` | `1.1 varnish` | Respons melewati server cache (CDN) |
| `X-Cache` | `HIT` | Respons diambil dari cache CDN, bukan dari server asal |
| `X-Served-By` | `cache-sin-wsat1880065-SIN` | Dilayani oleh edge server CDN di Singapura |

**1. Mekanisme 304 Not Modified.**
Saat Warm Load, browser mengirim header `If-None-Match` (berisi ETag) dan `If-Modified-Since` untuk menanyakan apakah berkas sudah berubah. Karena ETag masih sama, server membalas **304 Not Modified** tanpa mengirim isi berkas. Akibatnya, dokumen hanya memakan 135 B (header saja), bukan 7,7 kB.

**2. Mengapa dokumen tetap divalidasi walau `max-age=600`.**
Tombol reload (`F5`) membuat browser mengirim `Cache-Control: max-age=0`, yang memaksa validasi ulang untuk dokumen utama. Sementara itu, berkas pendukung (CSS, JS, font, gambar) langsung diambil dari *memory cache* dalam 0 ms tanpa menghubungi server sama sekali.

**3. Peran CDN (Jamstack).**
Header `Via: varnish`, `X-Cache: HIT`, dan `X-Served-By: ...SIN` menunjukkan GitHub Pages menyajikan situs melalui jaringan CDN. Permintaan dijawab oleh edge server terdekat, bukan server asal. Hal ini sesuai dengan karakteristik arsitektur Jamstack, yaitu aset statis dan data JSON disajikan dari CDN tanpa server aplikasi yang berjalan terus-menerus.

**4. Analisis TTFB.**
TTFB Cold Load (512,30 ms) jauh lebih tinggi daripada Warm Load (31,15 ms). Pada Cold Load, browser meminta dokumen tanpa memakai cache, sehingga waktu tunggu respons server lebih lama. Pada Warm Load, permintaan hanya berupa validasi ringan yang dijawab cepat oleh CDN dengan status 304.

**5. Dampak pada arsitektur CSR.**
Berkas `profile.json`, `projects.json`, dan `services.json` pada Warm Load diambil dari *disk cache* dalam 2–3 ms. Artinya, lapisan data JSON yang terpisah (*decoupled*) juga mendapat manfaat caching, sehingga proses rendering kartu di sisi klien bisa berjalan hampir seketika.

### Catatan dan Rekomendasi

- Pengukuran dilakukan saat halaman berada di posisi paling atas. Jika halaman digulir sampai bagian portofolio, gambar proyek ikut dimuat (globora.png 312 kB, imuniku.png 652 kB, labersa.png 354 kB, dummymine.jpg 35,4 kB), sehingga Cold Load naik menjadi 22 request dan 1,8 MB data ditransfer.
- Rekomendasi optimasi: kompres gambar proyek ke format **WebP** dan tambahkan atribut `loading="lazy"` untuk mengurangi beban Cold Load.
- Nilai waktu dapat berbeda di setiap percobaan karena kondisi jaringan. Untuk hasil yang lebih akurat, pengukuran sebaiknya diulang beberapa kali lalu dirata-rata.

### Screenshot Hasil Pengukuran

**Cold Load – Waterfall**
![Cold Load Waterfall](docs/screenshots/cold-load-waterfall.png)

**Cold Load – Timing (TTFB)**
![Cold Load Timing](docs/screenshots/cold-load-timing.png)

**Warm Load – Waterfall**
![Warm Load Waterfall](docs/screenshots/warm-load-waterfall.png)

**Warm Load – Timing (TTFB)**
![Warm Load Timing](docs/screenshots/warm-load-timing.png)

**Warm Load – Response Headers (304, ETag, Cache-Control)**
![Warm Load Headers](docs/screenshots/warm-load-headers.