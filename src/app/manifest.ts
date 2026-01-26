import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaderisasi Salman",
    short_name: "Kaderisasi",
    description:
      "Portal Aktivis Salman - Pusat pendaftaran kegiatan kaderisasi di Masjid Salman ITB",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#228be6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
