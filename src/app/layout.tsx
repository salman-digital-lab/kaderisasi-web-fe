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

export const metadata = {
  title: {
    template: "%s | Kaderisasi Salman",
    default: "Kaderisasi Salman",
  },
  description:
    "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman.",
  openGraph: {
    title: "Kaderisasi Salman",
    description:
      "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman.",
    type: "website",
    images: [
      {
        url: "https://nos.wjv-1.neo.id/kaderisasi-static/kaderisasi-main-banner.png",
        width: 2034,
        height: 1152,
        alt: "Kaderisasi Salman",
      },
    ],
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Kaderisasi Salman",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

  return (
    <html lang="en" {...mantineHtmlProps}>
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
        <MantineProvider>
          <Notifications position="top-center" />
          <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
