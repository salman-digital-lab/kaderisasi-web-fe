import { USER_LEVEL_ENUM } from "@/types/constants/profile";

export const KADERISASI_STAGES = [
  {
    level: USER_LEVEL_ENUM.JAMAAH,
    program: "Mulai mengenal Salman",
    description:
      "Titik awal ketika belum ada riwayat SSC, LMD, atau SPECTRA yang tercatat pada akun Anda.",
  },
  {
    level: USER_LEVEL_ENUM.AKTIVIS,
    program: "SSC",
    description:
      "Riwayat Salman Spiritual Camp sudah tercatat. Mulai terlibat dalam lingkungan pembinaan dan kegiatan Salman.",
  },
  {
    level: USER_LEVEL_ENUM.KADER,
    program: "LMD",
    description:
      "Riwayat Latihan Mujtahid Dakwah sudah tercatat. Lanjutkan proses belajar, memimpin, dan berkontribusi.",
  },
  {
    level: USER_LEVEL_ENUM.KADER_LANJUT,
    program: "SPECTRA",
    description:
      "Riwayat SPECTRA sudah tercatat. Kembangkan kontribusi melalui kaderisasi lanjut.",
  },
] as const;

export const KADERISASI_PROGRAMS = [
  {
    id: "ssc",
    name: "SSC",
    title: "Salman Spiritual Camp",
    focus: "Mengenal diri, menguatkan spiritualitas",
    description:
      "Awali perjalanan dengan ruang untuk berefleksi, mengenali tujuan diri, dan mendekat kepada Allah. SSC menjadi pintu masuk pembinaan kaderisasi Salman.",
    from: USER_LEVEL_ENUM.JAMAAH,
    to: USER_LEVEL_ENUM.AKTIVIS,
  },
  {
    id: "lmd",
    name: "LMD",
    title: "Latihan Mujtahid Dakwah",
    focus: "Melatih cara berpikir dan kepemimpinan",
    description:
      "Perdalam cara berpikir, kepemimpinan, dan ijtihad teknologi untuk menjawab persoalan umat. Proses belajar ini mengajak aktivis menghubungkan nilai yang dipahami dengan kontribusi nyata.",
    from: USER_LEVEL_ENUM.AKTIVIS,
    to: USER_LEVEL_ENUM.KADER,
  },
  {
    id: "spectra",
    name: "SPECTRA",
    title: "Kaderisasi lanjut",
    focus: "Melanjutkan kontribusi bagi umat dan peradaban",
    description:
      "SPECTRA melanjutkan perjalanan pembinaan setelah LMD. Pada tahap ini, kader diajak terus berkarya dan mengambil peran dalam membangun manfaat bagi umat dan peradaban.",
    from: USER_LEVEL_ENUM.KADER,
    to: USER_LEVEL_ENUM.KADER_LANJUT,
  },
] as const;

export const BMKA_SOURCES = [
  {
    label: "Profil BMKA di Masjid Salman ITB",
    href: "https://salmanitb.com/informasi/bidang/bidang-mahasiswa-kaderisasi-dan-alumni-bmka",
  },
  {
    label: "Salman Spiritual Camp",
    href: "https://kaderisasi.salmanitb.com/activity/salman-spiritual-camp-69",
  },
  {
    label: "Latihan Mujtahid Dakwah",
    href: "https://kaderisasi.salmanitb.com/activity/soulventure-lmd-237",
  },
  {
    label: "Kaderisasi lanjut SPECTRA",
    href: "https://kaderisasi.salmanitb.com/activity/pendaftaran-kapro-kaderisasi-lanjut-spectra",
  },
] as const;
