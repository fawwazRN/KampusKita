export const programs = [
  {
    id: "pai",
    name: "S1 Pendidikan Agama Islam",
    shortName: "PAI",
    degree: "S.Pd.",
    badge: null,
    icon: "book-open",
    description:
      "Program studi yang mempelajari pendidikan Islam secara komprehensif, mengintegrasikan ilmu keislaman, pedagogi modern, dan pengembangan pendidikan agama bagi berbagai latar belakang. Disiapkan untuk mencetak pendidik Islam profesional dan berwawasan luas.",
    tagline: "Paham Islam secara utuh: aqidah, fiqih, tafsir & hadis.",
    highlights: [
      "Pemahaman Islam yang utuh dan komprehensif",
      "Kompetensi pedagogi modern untuk masa depan",
      "Kuliah fleksibel dari mana saja, kapan saja",
      "Gelar S.Pd.",
    ],
    curriculum: null,
  },
  {
    id: "pgmi",
    name: "S1 Pendidikan Guru Madrasah Ibtidaiyah",
    shortName: "PGMI",
    degree: "S.Pd.",
    badge: "Prodi Baru",
    icon: "school",
    description:
      "Program studi baru yang mempelajari pendidikan dasar Islam, pembelajaran anak usia sekolah dasar, dan pengembangan pembelajaran madrasah ibtidaiyah. Didesain untuk memenuhi kebutuhan guru MI/SD yang berkualitas.",
    tagline: "Mampu mengajarkan ilmu kepada siswa, keluarga & masyarakat.",
    highlights: [
      "Pendidikan dasar Islam yang solid",
      "Pembelajaran anak usia SD/MI",
      "Kuliah fleksibel dari mana saja, kapan saja",
      "Gelar S.Pd.",
    ],
    curriculum: null,
  },
];

export const programById = (id) =>
  programs.find((program) => program.id === id) ?? programs[0];
