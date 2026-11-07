/** Indonesian text for the email change API codes. */
export const EMAIL_CHANGE_MESSAGES: Record<string, string> = {
  INVALID_EMAIL: "Format email tidak valid.",
  EMAIL_UNCHANGED: "Email baru sama dengan email sekarang.",
  EMAIL_ALREADY_REGISTERED: "Email tersebut sudah dipakai akun lain.",
  WRONG_PASSWORD: "Password yang dimasukkan salah.",
  ACCOUNT_INACTIVE: "Akun ini tidak dapat mengubah email.",
  EMAIL_CHANGE_TOO_SOON:
    "Tunggu satu menit sebelum meminta perubahan email lagi.",
  EMAIL_CHANGE_LIMIT:
    "Terlalu banyak permintaan perubahan email. Coba lagi dalam satu jam.",
  EMAIL_CHANGE_NOT_FOUND:
    "Tidak ada permintaan perubahan email yang menunggu. Silakan mulai lagi.",
  INVALID_CODE: "Kode salah. Periksa kembali kode di email Anda.",
  CODE_EXPIRED: "Kode sudah kedaluwarsa. Silakan minta kode baru.",
  TOO_MANY_ATTEMPTS:
    "Terlalu banyak percobaan kode yang salah. Silakan mulai lagi.",
  INVALID_TOKEN:
    "Tautan konfirmasi tidak valid, sudah dipakai, atau sudah kedaluwarsa.",
  SEND_EMAIL_FAILED: "Email gagal dikirim. Silakan coba lagi.",
};

/** Refusals after which the member has to start again from the email form. */
export const RESTART_MESSAGES = [
  "TOO_MANY_ATTEMPTS",
  "CODE_EXPIRED",
  "EMAIL_CHANGE_NOT_FOUND",
].map((code) => EMAIL_CHANGE_MESSAGES[code]);
