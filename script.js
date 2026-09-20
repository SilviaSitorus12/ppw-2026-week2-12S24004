// GitHub Pages hanya menyajikan file statis, jadi formulir tidak bisa dikirim ke server.
// Skrip ini menampilkan pesan konfirmasi setelah validasi bawaan HTML5 lolos.
const form = document.getElementById("form-konsultasi");
const status = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent =
    "Terima kasih, permintaan konsultasi Anda sudah tercatat. (Simulasi: data belum dikirim ke server.)";
  form.reset();
});

// ---------------------------------------------------------
// Penanda menu: tautan yang aktif mengikuti bagian yang sedang dibaca
// ---------------------------------------------------------
const navLinks = new Map(
  [...document.querySelectorAll(".nav-list a")].map((a) => [a.getAttribute("href").slice(1), a])
);
const watched = ["beranda", "tentang", "portofolio", "layanan"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      const active = navLinks.get(entry.target.id);
      if (active) active.setAttribute("aria-current", "true");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
watched.forEach((section) => sectionObserver.observe(section));

// Bayangan tipis pada header setelah halaman digulir
const header = document.querySelector(".site-header");
const toggleHeaderShadow = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
toggleHeaderShadow();
window.addEventListener("scroll", toggleHeaderShadow, { passive: true });