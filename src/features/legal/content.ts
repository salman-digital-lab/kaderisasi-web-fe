export const LEGAL_CONTACT_EMAIL = "digilab@salmanitb.com";
export const LEGAL_UPDATED_DATE = "9 September 2026";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const privacySections: LegalSection[] = [
  {
    id: "cakupan",
    title: "Pengelola dan cakupan kebijakan",
    paragraphs: [
      "Kaderisasi Salman adalah portal yang dikelola oleh Bidang Kemahasiswaan, Kaderisasi dan Alumni (BMKA) Salman ITB. Kebijakan ini menjelaskan pengolahan data pada portal publik Kaderisasi Salman dan dasbor administrasinya, termasuk ketika Anda menggunakan fitur Masuk dengan Google.",
      "Kebijakan ini berlaku untuk data yang diproses melalui layanan kami. Situs atau layanan pihak ketiga yang Anda kunjungi melalui tautan memiliki kebijakan privasinya sendiri.",
    ],
  },
  {
    id: "data",
    title: "Data yang kami kumpulkan",
    paragraphs: [
      "Data akun dan profil: nama, alamat email, informasi autentikasi, serta data yang Anda isi seperti foto, tanggal lahir, jenis kelamin, nomor identitas jika diminta, kontak WhatsApp, domisili, pendidikan, pekerjaan, akun media sosial, dan riwayat keterlibatan di Salman. Kolom yang diminta bergantung pada fitur dan formulir yang Anda gunakan.",
      "Data layanan: pendaftaran kegiatan dan klub, jawaban formulir, berkas yang diunggah, prestasi dan bukti pendukung, catatan keikutsertaan, sertifikat, serta pengajuan dan keputusan akses admin.",
      "Data konsultasi: identitas atau kontak yang Anda berikan, kategori dan uraian masalah, preferensi konselor, serta catatan tindak lanjut pada Ruang Curhat. Hindari menyertakan data pribadi orang lain yang tidak diperlukan atau yang tidak berhak Anda bagikan.",
      "Data teknis: informasi sesi, alamat IP, jenis peramban atau perangkat, waktu akses, dan catatan permintaan atau kesalahan. Situs produksi juga menggunakan Umami untuk memahami penggunaan halaman dan memperbaiki layanan.",
    ],
  },
  {
    id: "google",
    title: "Data dari Masuk dengan Google",
    paragraphs: [
      "Saat Anda memilih Masuk dengan Google, kami memverifikasi token identitas dari Google untuk memperoleh identitas akun Google, alamat email, status verifikasi email, dan nama profil yang tersedia. Kami menyimpan pengenal akun Google, email, nama akun layanan, dan informasi waktu penggunaan untuk menghubungkan akun dan mengelola sesi masuk.",
      "Fitur ini digunakan untuk autentikasi. Fitur Masuk dengan Google tidak meminta akses untuk membaca Gmail, Google Drive, kontak, atau kalender, dan kami tidak menerima kata sandi Google Anda. Masuk dengan Google tidak otomatis memberikan hak administrasi; akses fitur admin mengikuti peran yang diberikan.",
      "Data Google digunakan untuk menyediakan dan mengamankan layanan yang Anda gunakan, bukan untuk menjual data, membuat iklan yang dipersonalisasi, atau melatih model AI umum. Penggunaan informasi dari Google mengikuti Google API Services User Data Policy, termasuk ketentuan Limited Use yang berlaku.",
    ],
  },
  {
    id: "tujuan",
    title: "Tujuan penggunaan data",
    paragraphs: [
      "Kami menggunakan data untuk membuat dan mengautentikasi akun, mengelola profil serta pendaftaran, menyelenggarakan kegiatan dan layanan konsultasi, memeriksa prestasi, menerbitkan dan memverifikasi sertifikat, memproses permintaan akses, serta menanggapi pertanyaan atau keluhan.",
      "Data teknis digunakan untuk menjaga keamanan akun, mencegah penyalahgunaan, menangani gangguan, dan mengevaluasi penggunaan layanan. Pemrosesan dilakukan sesuai kebutuhan penyediaan layanan, persetujuan yang relevan, dan kewajiban yang berlaku. Untuk penggunaan baru yang memerlukan persetujuan, kami akan memberikan penjelasan sebelum meminta persetujuan tersebut.",
    ],
  },
  {
    id: "berbagi",
    title: "Akses, publikasi, dan pembagian data",
    paragraphs: [
      "Data dapat diakses oleh pengelola dan petugas yang berwenang untuk menjalankan tugasnya, misalnya panitia, pengelola klub, peninjau prestasi, konselor, atau administrator. Informasi Ruang Curhat digunakan untuk penanganan konsultasi dan bukan untuk ditampilkan pada peringkat publik.",
      "Fitur publik seperti peringkat dan verifikasi sertifikat dapat menampilkan informasi yang terkait dengan fitur tersebut, misalnya nama peserta, pencapaian, kegiatan, atau status sertifikat. Tautan dan berkas yang Anda bagikan kepada orang lain juga dapat diakses oleh penerimanya.",
      "Penyedia infrastruktur yang mendukung hosting, basis data, penyimpanan berkas, email, analitik, dan autentikasi dapat memproses data yang diperlukan untuk menyediakan layanan tersebut. Google memproses autentikasi menurut kebijakannya sendiri. Data juga dapat diungkapkan ketika diwajibkan oleh hukum atau diperlukan untuk menangani penyalahgunaan dan melindungi hak pengguna. Kami tidak menjual data pribadi Anda.",
    ],
  },
  {
    id: "penyimpanan",
    title: "Penyimpanan dan keamanan",
    paragraphs: [
      "Data akun dan layanan disimpan pada basis data serta penyimpanan berkas yang digunakan oleh pengelola. Kami menggunakan pembatasan akses berdasarkan peran dan mekanisme autentikasi untuk membantu melindungi data. Lokasi pemrosesan dapat mengikuti infrastruktur penyedia layanan yang digunakan. Tidak ada sistem yang sepenuhnya bebas dari risiko keamanan.",
      "Data disimpan selama diperlukan untuk penyediaan layanan, pencatatan kegiatan dan sertifikat, keamanan, penyelesaian permintaan, atau kewajiban yang berlaku. Kebutuhan penyimpanan dapat berbeda antarjenis data. Penghapusan dapat dibatasi untuk catatan yang masih diperlukan; salinan cadangan dapat tetap ada sampai siklus penyimpanannya berakhir.",
    ],
  },
  {
    id: "cookie",
    title: "Cookie dan penyimpanan peramban",
    paragraphs: [
      "Layanan menggunakan cookie atau penyimpanan peramban untuk kebutuhan sesi, autentikasi, dan preferensi. Google dapat menggunakan mekanisme peramban tersendiri ketika Anda memilih fitur masuknya. Menonaktifkan atau menghapus cookie dapat membuat Anda keluar dari akun atau membatasi fungsi tertentu.",
    ],
  },
  {
    id: "hak",
    title: "Pilihan, koreksi, dan penghapusan data",
    paragraphs: [
      "Anda dapat memperbarui informasi melalui fitur profil yang tersedia. Untuk meminta akses, koreksi, penghapusan akun atau data pribadi, maupun menarik persetujuan atas pemrosesan tertentu, hubungi kontak yang tercantum di bawah. Sertakan email akun dan jenis permintaan; jangan mengirim kata sandi, token masuk, atau dokumen sensitif yang tidak diminta.",
      "Kami dapat meminta verifikasi identitas yang proporsional untuk melindungi akun. Permintaan akan ditinjau berdasarkan data yang terkait, kebutuhan layanan, serta kewajiban yang berlaku. Jika sebagian data perlu dipertahankan, kami akan menjelaskan alasannya. Penghapusan akun dapat menyebabkan akses atau riwayat layanan tidak lagi tersedia.",
      "Anda dapat mencabut hubungan aplikasi dengan Google melalui pengaturan koneksi pihak ketiga pada Akun Google. Mencabut koneksi tidak otomatis menghapus data yang telah tersimpan pada Kaderisasi Salman; ajukan permintaan penghapusan secara terpisah.",
    ],
  },
  {
    id: "anak",
    title: "Pengguna di bawah umur",
    paragraphs: [
      "Jika Anda belum cukup umur untuk memberikan persetujuan yang sah, mintalah pendampingan dan persetujuan orang tua atau wali sebelum memberikan data pribadi. Orang tua atau wali dapat menghubungi kami untuk menanyakan atau meminta penanganan data anaknya. Persyaratan usia kegiatan dapat berbeda dan dicantumkan oleh penyelenggara.",
    ],
  },
  {
    id: "perubahan",
    title: "Perubahan kebijakan",
    paragraphs: [
      "Kami dapat memperbarui kebijakan ini ketika fitur, pemrosesan data, atau ketentuan yang berlaku berubah. Tanggal pembaruan ditampilkan pada halaman ini. Perubahan penting akan diinformasikan melalui sarana yang sesuai, dan persetujuan baru akan diminta jika diperlukan.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: "layanan",
    title: "Tentang layanan dan ketentuan ini",
    paragraphs: [
      "Kaderisasi Salman merupakan portal BMKA Salman ITB untuk informasi dan pendaftaran kegiatan, keanggotaan, klub, prestasi, konsultasi, sertifikat, dan administrasi terkait. Ketentuan ini berlaku untuk portal publik dan dasbor administrasi Kaderisasi Salman.",
      "Dengan menggunakan layanan, Anda menyetujui ketentuan yang berlaku untuk penggunaannya. Jika Anda tidak menyetujuinya, jangan melanjutkan penggunaan akun atau fitur layanan. Pengolahan data pribadi dijelaskan secara terpisah dalam Kebijakan Privasi.",
    ],
  },
  {
    id: "akun",
    title: "Akun dan keamanan",
    paragraphs: [
      "Berikan informasi yang benar dan perbarui data yang relevan. Gunakan akun Anda sendiri dan jaga kerahasiaan kata sandi serta sarana autentikasi. Jangan membagikan akses akun atau menggunakan identitas orang lain tanpa kewenangan.",
      "Jika tersedia, Masuk dengan Google merupakan salah satu cara autentikasi. Pembuatan akun tidak menjamin pemberian peran admin atau akses ke seluruh fitur. Hak akses dapat diberikan, diubah, atau dicabut oleh pengelola sesuai tugas dan kebutuhan layanan.",
      "Laporkan dugaan penggunaan akun tanpa izin kepada kami. Pengguna yang belum cukup umur untuk memberikan persetujuan yang sah perlu memperoleh pendampingan dan persetujuan orang tua atau wali.",
    ],
  },
  {
    id: "kegiatan",
    title: "Pendaftaran dan keikutsertaan",
    paragraphs: [
      "Setiap kegiatan, klub, atau program dapat memiliki syarat peserta, kuota, jadwal, proses seleksi, biaya jika ada, dan aturan pembatalan tersendiri. Baca informasi yang ditampilkan sebelum mengirim pendaftaran. Mengirim formulir tidak selalu berarti Anda telah diterima.",
      "Pengelola dapat melakukan verifikasi dan meminta kelengkapan yang relevan. Perubahan jadwal, penerimaan, atau pelaksanaan diinformasikan melalui kanal kegiatan yang tersedia. Jika suatu kegiatan berbayar, ketentuan pembayaran dan pengembalian dana mengikuti informasi yang diberikan penyelenggara untuk kegiatan tersebut.",
    ],
  },
  {
    id: "penggunaan",
    title: "Penggunaan yang diperbolehkan",
    paragraphs: [
      "Gunakan layanan untuk keperluan yang sah dan berkaitan dengan aktivitas yang disediakan. Dilarang melakukan penipuan, pemalsuan data atau bukti, pelecehan, penyebaran konten melanggar hukum, pengiriman spam, atau penggunaan data peserta di luar kewenangan Anda.",
      "Jangan mencoba melewati pembatasan akses, mengambil akun orang lain, mengganggu sistem, atau mengumpulkan dan menyebarkan data pribadi pengguna lain tanpa dasar yang sah. Pengguna admin hanya boleh mengakses, mengekspor, dan menggunakan data sesuai tugas serta hak aksesnya.",
    ],
  },
  {
    id: "konten",
    title: "Konten dan berkas yang Anda kirim",
    paragraphs: [
      "Anda bertanggung jawab atas isi formulir, foto, dokumen, dan bukti yang Anda kirim, termasuk memastikan Anda berhak membagikannya. Kirim hanya data yang diperlukan untuk layanan yang dipilih.",
      "Anda tetap memiliki hak atas konten milik Anda. Dengan mengirimkan konten, Anda memberi pengelola izin terbatas untuk menyimpan, memeriksa, menampilkan, dan memprosesnya sejauh diperlukan untuk menyediakan fitur yang Anda gunakan, sesuai Kebijakan Privasi. Konten yang melanggar ketentuan dapat ditolak atau dihapus.",
    ],
  },
  {
    id: "prestasi",
    title: "Prestasi, peringkat, dan sertifikat",
    paragraphs: [
      "Pengakuan prestasi, perhitungan peringkat, dan penerbitan sertifikat bergantung pada verifikasi serta aturan program yang berlaku. Pengelola dapat memperbaiki data atau mencabut sertifikat jika ditemukan kekeliruan, ketidaklayakan, atau penyalahgunaan.",
      "Jangan mengubah, memalsukan, atau menggunakan sertifikat di luar hak Anda. Verifikasi sertifikat membantu memeriksa catatan penerbitan, bukan menjamin hal lain di luar informasi yang ditampilkan.",
    ],
  },
  {
    id: "konsultasi",
    title: "Ruang Curhat",
    paragraphs: [
      "Ruang Curhat digunakan untuk mengajukan kebutuhan konsultasi dan mengatur tindak lanjut yang tersedia. Layanan ini bukan kanal tanggap darurat dan tidak menjamin respons seketika. Dalam keadaan darurat atau ketika keselamatan terancam, hubungi layanan darurat atau tenaga profesional yang sesuai di wilayah Anda.",
    ],
  },
  {
    id: "ketersediaan",
    title: "Ketersediaan dan layanan pihak ketiga",
    paragraphs: [
      "Kami berupaya menyediakan informasi dan fungsi yang dapat digunakan, namun gangguan, pemeliharaan, kesalahan data, atau perubahan fitur dapat terjadi. Kami tidak menjanjikan layanan selalu tersedia atau bebas kesalahan. Laporkan kesalahan yang Anda temukan agar dapat ditinjau.",
      "Tautan, autentikasi, dan layanan pihak ketiga tunduk pada ketentuan masing-masing penyedia. Ketentuan ini tidak menghapus hak pengguna atau tanggung jawab yang tidak dapat dikesampingkan berdasarkan hukum yang berlaku.",
    ],
  },
  {
    id: "penghentian",
    title: "Pembatasan dan penghentian akses",
    paragraphs: [
      "Pengelola dapat membatasi atau menonaktifkan akses untuk menangani pelanggaran, risiko keamanan, atau kebutuhan pengelolaan layanan. Jika Anda menganggap pembatasan tidak tepat, hubungi kami untuk meminta peninjauan.",
      "Anda dapat berhenti menggunakan layanan dan mengajukan penghapusan akun melalui kontak pada Kebijakan Privasi. Berhenti menggunakan layanan atau mencabut koneksi Google tidak otomatis menghapus catatan yang telah tersimpan.",
    ],
  },
  {
    id: "perubahan",
    title: "Perubahan dan penyelesaian pertanyaan",
    paragraphs: [
      "Ketentuan dapat diperbarui sesuai perubahan layanan atau persyaratan yang berlaku. Versi terbaru dan tanggal pembaruan ditampilkan pada halaman ini; perubahan penting akan diinformasikan melalui sarana yang sesuai.",
      "Untuk pertanyaan, keluhan, atau perselisihan mengenai layanan, hubungi pengelola agar dapat diupayakan penyelesaian terlebih dahulu. Ketentuan ini mengikuti hukum Republik Indonesia dengan tetap menghormati hak pengguna yang berlaku.",
    ],
  },
];
