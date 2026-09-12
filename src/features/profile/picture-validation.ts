export function validateProfilePicture(file: {
  type: string;
  size: number;
}): string | undefined {
  if (!["image/jpeg", "image/png"].includes(file.type))
    return "Pilih foto berformat JPG atau PNG.";
  if (file.size > 2 * 1024 * 1024) return "Ukuran foto maksimal 2 MB.";
  if (file.size === 0) return "File foto kosong. Pilih foto lain.";
  return undefined;
}
