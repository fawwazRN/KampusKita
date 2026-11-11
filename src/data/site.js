const env = import.meta.env;

export const site = {
  name: "Kuliah Islam Abu Dzar",
  shortName: "KITA",
  legalName: "Kuliah Islam Abu Dzar",
  tagline: "Kuliah Islam Terbuka untuk Semua Kalangan",
  description:
    "Kuliah Islam Abu Dzar (KITA) membuka pendaftaran mahasiswa baru semester genap 2026/2027. Program S1 Pendidikan Agama Islam (PAI) dan S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI), gelar S.Pd., kuliah online fleksibel via Google Meet dan Google Classroom.",
  siteUrl: env.VITE_SITE_URL || "https://kampuskita.id",
  email: "kita@abudzar.or.id",
  phoneDisplay: "0822 1706 6090",
  phoneRaw: "082217066090",
  whatsapp: "6282217066090",
  manager: "Yayasan Abu Dzar",
  parentCampus: null, // diisi setelah nama kampus induk dikonfirmasi
  address:
    "Jl. Sumatera Gg. H. Bakrie 003/007, Jombang, Ciputat, Tangerang Selatan 15414, Banten",
  mapsQuery:
    "Jl. Sumatera Gg. H. Bakrie 003/007, Jombang, Ciputat, Tangerang Selatan 15414, Banten",
  bank: {
    name: "BSI",
    account: "7014991788",
    holder: "Yayasan Abu Dzar",
  },
  registration: {
    externalUrl: env.VITE_REGISTRATION_URL || "",
    period: "Dibuka",
    startDate: null,
  },
  social: {
    instagram: "https://www.instagram.com/kuliahabudzar",
    instagramHandle: "@kuliahabudzar",
    youtube: "https://www.youtube.com/@mediaabudzar",
    youtubeLabel: "Media Abu Dzar",
  },
  analytics: {
    ga4: env.VITE_GA4_ID || "",
    metaPixel: env.VITE_META_PIXEL_ID || "",
  },
  nav: [
    { label: "Beranda", href: "#beranda" },
    { label: "Program Studi", href: "#program-studi" },
    { label: "Biaya", href: "#biaya" },
    { label: "Cara Daftar", href: "#cara-daftar" },
    { label: "Dosen", href: "#dosen" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontak", href: "#kontak" },
    {
      label: "Portal KITA",
      href: "https://apps.kampuskita.id/",
      external: true,
      newTab: true,
    },
  ],
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  site.mapsQuery,
)}&z=16&output=embed`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.mapsQuery,
)}`;

export function getRegistrationUrl() {
  if (site.registration.externalUrl) return site.registration.externalUrl;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${window.location.pathname}#daftar`;
  }
  return `${site.siteUrl}/#daftar`;
}

export function whatsappUrl(
  message = "Assalamu'alaikum, saya ingin bertanya tentang pendaftaran Kuliah Islam Abu Dzar semester genap 2026/2027.",
) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
