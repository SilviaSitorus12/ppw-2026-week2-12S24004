// =====================================================================
// api-service.js — DATA ACCESS LAYER
// -----------------------------------------------------------------------
// Satu-satunya tugas berkas ini: mengambil data dan mengembalikannya.
// Tidak ada satu baris pun di sini yang menyentuh DOM (document.querySelector,
// innerHTML, dsb.) — itu tugas app.js. Pemisahan ini yang dimaksud modul
// sebagai "Application/Service Logic Tier" pada arsitektur decoupled.
//
// Semua fungsi memakai async/await + try/catch, mengikuti pola pertahanan
// berlapis (defensive error handling) seperti dicontohkan modul.
// =====================================================================

const ApiService = (() => {
  "use strict";

  /**
   * Pengambil data generik dari berkas JSON lokal.
   * Melempar Error yang jelas kalau responsnya bukan 200-an atau JSON-nya rusak,
   * supaya app.js bisa menampilkan status Error yang informatif, bukan diam saja.
   */
  async function getJSON(path) {
    let response;
    try {
      response = await fetch(path);
    } catch (networkErr) {
      // Kegagalan jaringan murni: domain tidak terjangkau, CORS, dsb.
      throw new Error(`Tidak bisa menghubungi "${path}". Periksa koneksi internet Anda.`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} saat memuat "${path}": ${response.statusText}`);
    }

    try {
      return await response.json();
    } catch (parseErr) {
      throw new Error(`Berkas "${path}" ditemukan, tetapi format JSON-nya tidak valid.`);
    }
  }

  /** Mengambil seluruh data proyek portofolio. */
  async function fetchProjects() {
    return getJSON("data/projects.json");
  }

  /** Mengambil katalog layanan. */
  async function fetchServices() {
    return getJSON("data/services.json");
  }

  /** Mengambil biodata dan statistik profil. */
  async function fetchProfile() {
    return getJSON("data/profile.json");
  }

  /**
   * Simulasi endpoint REST POST untuk pengiriman formulir layanan.
   * GitHub Pages hanya menyajikan berkas statis dan tidak punya server
   * sungguhan untuk menerima POST, jadi di sini kita mensimulasikan jeda
   * jaringan (600ms) lalu "meluluskan" permintaan, persis seperti memanggil
   * REST API asli, tanpa mengubah cara app.js memanggilnya. Kalau suatu
   * saat diganti endpoint sungguhan, cukup fungsi ini yang diubah.
   */
  async function submitServiceOrder(payload) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulasi validasi sisi "server": payload wajib punya field inti.
    if (!payload || !payload.nama || !payload.email) {
      throw new Error("Data pesanan tidak lengkap.");
    }

    return {
      status: "success",
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      receivedAt: new Date().toISOString(),
    };
  }

  // Antarmuka publik: hanya fungsi ini yang boleh dipanggil dari app.js.
  return { fetchProjects, fetchServices, fetchProfile, submitServiceOrder };
})();