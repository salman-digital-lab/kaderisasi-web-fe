import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import ScrollToTop from "@/components/common/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://kaderisasi.salmanitb.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Kaderisasi Salman",
    default: "Kaderisasi Salman",
  },
  description:
    "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman.",
  keywords: [
    "Kaderisasi Salman",
    "Masjid Salman ITB",
    "BMKA Salman",
    "Aktivis Salman",
    "Kaderisasi Mahasiswa",
    "Pendaftaran Kegiatan",
    "Pembinaan Mahasiswa Islam",
    "Salman ITB",
  ],
  authors: [{ name: "BMKA Salman ITB" }],
  creator: "BMKA Salman ITB",
  publisher: "BMKA Salman ITB",
  openGraph: {
    title: "Kaderisasi Salman",
    description:
      "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "https://nos.wjv-1.neo.id/kaderisasi-static/kaderisasi-main-banner.png",
        width: 2034,
        height: 1152,
        alt: "Kaderisasi Salman - Portal Aktivis Salman ITB",
      },
    ],
    url: BASE_URL,
    siteName: "Kaderisasi Salman",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaderisasi Salman",
    description:
      "Portal Aktivis Salman yang dikelola BMKA Salman sebagai pusat pendaftaran kegiatan kaderisasi.",
    images: [
      "https://nos.wjv-1.neo.id/kaderisasi-static/kaderisasi-main-banner.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification here if you have one
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  return (
    <html lang="id" className={inter.className} {...mantineHtmlProps}>
      <head>
        {isProduction && (
          <Script
            defer
            src="https://umami-kaderisasi.salmanitb.com/script.js"
            data-website-id="2bf5419c-a004-4d29-9fd2-999176beb2ab"
          />
        )}
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={{ fontFamily: inter.style.fontFamily }}>
          <Suspense>
            <ScrollToTop />
          </Suspense>
          <Notifications position="top-center" />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
