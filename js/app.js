// =====================================================================
// app.js — PRESENTATION LAYER
// -----------------------------------------------------------------------
// Berkas ini yang menyentuh DOM. Semua datanya diminta lewat ApiService
// (api-service.js), berkas ini sendiri tidak pernah memanggil fetch()
// langsung — itu prinsip Separation of Concerns yang diminta modul.
// =====================================================================

(() => {
  "use strict";

  // ------------------------------------------------------------------
  // Util kecil
  // ------------------------------------------------------------------

  /**
   * Pertahanan lapis pertama terhadap DOM-based XSS (lihat modul 3.4).
   * Data JSON kita sendiri sebenarnya tepercaya, tapi kita tetap
   * memperlakukannya seperti data dari luar sebagai kebiasaan yang aman:
   * jangan pernah menyuntikkan string mentah ke innerHTML.
   * Triknya: taruh string di textContent sebuah elemen sementara, lalu
   * ambil innerHTML-nya — browser otomatis meng-encode karakter berbahaya
   * seperti <script> menjadi teks biasa, bukan elemen baru.
   */
  function escapeHTML(value) {
    const temp = document.createElement("div");
    temp.textContent = value === null || value === undefined ? "" : String(value);
    return temp.innerHTML;
  }

  function show(el) { el.classList.remove("d-none"); }
  function hide(el) { el.classList.add("d-none"); }

  // ------------------------------------------------------------------
  // Penyimpanan lokal (State Lokal Sisi Klien)
  // ------------------------------------------------------------------
  const ORDER_STORAGE_KEY = "ppw_service_orders";

  function readOrderHistory() {
    try {
      const raw = localStorage.getItem(ORDER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      // localStorage bisa gagal (mode privat, kuota penuh, dsb.) — jangan
      // sampai seluruh halaman ikut rusak hanya karena riwayat gagal dibaca.
      console.warn("[localStorage] gagal membaca riwayat pesanan:", err);
      return [];
    }
  }

  function saveOrderToLocalStorage(order) {
    try {
      const history = readOrderHistory();
      history.push({ ...order, savedAt: new Date().toISOString() });
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(history));
      return history.length;
    } catch (err) {
      console.warn("[localStorage] gagal menyimpan pesanan:", err);
      return readOrderHistory().length;
    }
  }

  function renderOrderBadge() {
    const badge = document.getElementById("orderHistoryBadge");
    if (!badge) return;
    const count = readOrderHistory().length;
    if (count > 0) {
      badge.textContent = `${count} permintaan tersimpan di perangkat ini`;
      show(badge);
    } else {
      hide(badge);
    }
  }

  // ------------------------------------------------------------------
  // State aplikasi sederhana, disimpan di memori (bukan Redux dsb.,
  // cukup untuk skala tugas ini)
  // ------------------------------------------------------------------
  const state = {
    projects: [],       // seluruh data proyek, tidak berubah setelah dimuat
    activeCategory: "Semua",
  };

  // ------------------------------------------------------------------
  // BAGIAN 1: Portofolio — rendering dinamis + 4 UI states + filter
  // ------------------------------------------------------------------

  function projectCardHTML(project) {
    const tagsHTML = (project.tags || [])
      .map((t) => `<span class="badge tech-badge">${escapeHTML(t)}</span>`)
      .join("");

    return `
      <div class="col">
        <article class="card h-100 border-0 shadow-sm project-card">
          <div class="ratio ratio-4x3 card-banner">
            <img src="${escapeHTML(project.thumbnail)}" class="object-fit-cover"
                 alt="Tangkapan layar ${escapeHTML(project.title)}" loading="lazy">
          </div>
          <span class="badge rounded-pill badge-soft project-badge">${escapeHTML(project.category)}</span>
          <div class="card-body d-flex flex-column">
            <h3 class="h5 fw-bold">${escapeHTML(project.title)}</h3>
            <p class="small text-accent fw-semibold mb-2">${escapeHTML(project.role)}</p>
            <p class="card-text small text-body-secondary flex-grow-1">${escapeHTML(project.description)}</p>
            <div class="mb-3">${tagsHTML}</div>
            <button type="button" class="btn btn-brand btn-sm rounded-pill mt-auto"
                    data-project-id="${escapeHTML(project.id)}">
              Lihat detail
            </button>
          </div>
        </article>
      </div>`;
  }

  function renderCategoryFilters(projects) {
    const wrap = document.getElementById("categoryFilters");
    const categories = ["Semua", ...new Set(projects.map((p) => p.category))];

    wrap.innerHTML = categories
      .map((cat) => {
        const active = cat === state.activeCategory;
        const cls = active ? "btn-brand" : "btn-outline-brand";
        return `<button type="button" class="btn ${cls} btn-sm rounded-pill filter-btn"
                         data-category="${escapeHTML(cat)}">${escapeHTML(cat)}</button>`;
      })
      .join("");
  }

  function renderProjects() {
    const grid = document.getElementById("portfolioGrid");
    const empty = document.getElementById("portfolioEmpty");

    const filtered =
      state.activeCategory === "Semua"
        ? state.projects
        : state.projects.filter((p) => p.category === state.activeCategory);

    if (filtered.length === 0) {
      grid.innerHTML = "";
      show(empty);
      return;
    }
    hide(empty);
    grid.innerHTML = filtered.map(projectCardHTML).join("");
  }

  async function initPortfolio() {
    const loading = document.getElementById("portfolioLoading");
    const errorBox = document.getElementById("portfolioError");
    const errorMsg = document.getElementById("portfolioErrorMessage");
    const grid = document.getElementById("portfolioGrid");

    // Status LOADING: tampil dari awal lewat HTML, di sini kita pastikan
    // status lain dulu tersembunyi supaya tidak tumpang tindih.
    hide(errorBox);
    grid.innerHTML = "";

    try {
      const projects = await ApiService.fetchProjects();
      if (!Array.isArray(projects) || projects.length === 0) {
        throw new Error("Data proyek kosong.");
      }
      state.projects = projects;

      renderCategoryFilters(projects);
      renderProjects(); // status SUCCESS (atau EMPTY kalau filter tidak cocok)
    } catch (err) {
      console.error("[Portfolio]", err);
      errorMsg.textContent = err.message || "Gagal memuat data proyek.";
      show(errorBox); // status ERROR
    } finally {
      hide(loading); // loading selalu disembunyikan, apa pun hasilnya
    }
  }

  // Delegasi klik: satu listener di grid, bukan satu listener per kartu —
  // supaya kartu yang baru dirender ulang (setelah filter) tetap otomatis
  // bisa diklik, tanpa perlu memasang ulang event listener setiap saat.
  document.getElementById("portfolioGrid").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-project-id]");
    if (btn) openProjectModal(btn.dataset.projectId);
  });

  document.getElementById("categoryFilters").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-category]");
    if (!btn) return;
    state.activeCategory = btn.dataset.category;
    renderCategoryFilters(state.projects);
    renderProjects();
  });

  // ------------------------------------------------------------------
  // BAGIAN 2: Modal Universal — satu elemen, isi berganti sesuai id
  // ------------------------------------------------------------------
  function openProjectModal(projectId) {
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;

    document.getElementById("projectModalTitle").textContent = project.title;

    const tagsHTML = (project.tags || [])
      .map((t) => `<span class="badge tech-badge">${escapeHTML(t)}</span>`)
      .join(" ");

    document.getElementById("projectModalBody").innerHTML = `
      <img src="${escapeHTML(project.thumbnail)}" alt="Tangkapan layar ${escapeHTML(project.title)}"
           class="img-fluid rounded-3 mb-3">
      <p><strong>Peran:</strong> ${escapeHTML(project.role)}</p>
      <p>${escapeHTML(project.description)}</p>
      <div class="mb-2">${tagsHTML}</div>
      ${
        project.metrics
          ? `<p class="small text-body-secondary mb-0">Durasi sekitar ${escapeHTML(project.metrics.durationWeeks)} minggu,
             dikerjakan bersama ${escapeHTML(project.metrics.teamSize)} orang.</p>`
          : ""
      }`;

    const linkEl = document.getElementById("projectModalLink");
    linkEl.href = project.link || "#";
    linkEl.textContent = project.linkLabel || "Buka tautan";

    const modalEl = document.getElementById("universalProjectModal");
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  // ------------------------------------------------------------------
  // BAGIAN 3: Layanan — rendering dinamis + status loading/error
  // ------------------------------------------------------------------
  async function initServices() {
    const loading = document.getElementById("servicesLoading");
    const errorBox = document.getElementById("servicesError");
    const list = document.getElementById("servicesList");

    try {
      const services = await ApiService.fetchServices();
      list.innerHTML = services
        .map(
          (s) => `
        <li class="p-2 px-3 bg-white rounded-3 small fw-semibold" title="${escapeHTML(s.summary)}">
          <i class="bi ${escapeHTML(s.icon)} text-accent me-2"></i>${escapeHTML(s.name)}
        </li>`
        )
        .join("");
    } catch (err) {
      console.error("[Services]", err);
      show(errorBox);
    } finally {
      hide(loading);
    }
  }

  // ------------------------------------------------------------------
  // BAGIAN 4: Profil — mengisi hero secara progresif (teks statis di
  // HTML tetap jadi fallback kalau fetch gagal / JS mati)
  // ------------------------------------------------------------------
  async function initProfile() {
    try {
      const profile = await ApiService.fetchProfile();

      const nameEl = document.getElementById("heroName");
      const taglineEl = document.getElementById("heroTagline");
      const photoEl = document.getElementById("heroPhoto");
      if (nameEl) nameEl.textContent = `${profile.name}.`;
      if (taglineEl) taglineEl.textContent = profile.tagline;
      if (photoEl && profile.photo) photoEl.src = profile.photo;

      const statsWrap = document.getElementById("heroStats");
      if (statsWrap && profile.stats) {
        const entries = [
          ["Proyek selesai", profile.stats.projectsCompleted],
          ["Tahun belajar", profile.stats.yearsLearning],
          ["Sertifikasi", profile.stats.certifications],
        ];
        statsWrap.innerHTML = entries
          .map(
            ([label, num]) => `
          <div class="hero-stat">
            <span class="num">${escapeHTML(num)}</span>
            <span class="label">${escapeHTML(label)}</span>
          </div>`
          )
          .join("");
      }
    } catch (err) {
      // Fallback: biarkan teks statis bawaan HTML yang tampil. Ini contoh
      // penerapan progressive enhancement: halaman tetap bisa dibaca
      // walau profile.json gagal dimuat.
      console.warn("[Profile] memakai data statis, fetch gagal:", err);
    }
  }

  // ------------------------------------------------------------------
  // BAGIAN 5: Formulir layanan — kirim asinkron, Toast, localStorage
  // ------------------------------------------------------------------
  function initServiceForm() {
    const form = document.getElementById("form-konsultasi");
    const submitBtn = document.getElementById("submitBtn");
    const submitBtnText = document.getElementById("submitBtnText");
    const toastEl = document.getElementById("orderToast");
    const toastBody = document.getElementById("orderToastBody");
    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });

    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // selalu dicegah — kita kirim lewat fetch, bukan reload

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        event.stopPropagation();
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());

      submitBtn.disabled = true;
      submitBtnText.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Mengirim...';

      try {
        const result = await ApiService.submitServiceOrder(payload);

        saveOrderToLocalStorage({ ...payload, orderId: result.orderId });
        renderOrderBadge();

        toastBody.textContent = `Terima kasih! Permintaan Anda (${result.orderId}) sudah tercatat.`;
        toast.show();

        form.reset();
        form.classList.remove("was-validated");
      } catch (err) {
        console.error("[Form submit]", err);
        toastBody.textContent = "Maaf, pengiriman gagal. Silakan coba lagi.";
        toast.show();
      } finally {
        submitBtn.disabled = false;
        submitBtnText.textContent = "Kirim permintaan konsultasi";
      }
    });
  }

  // ------------------------------------------------------------------
  // Titik masuk
  // ------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initProfile();
    initPortfolio();
    initServices();
    initServiceForm();
    renderOrderBadge();
  });
})();