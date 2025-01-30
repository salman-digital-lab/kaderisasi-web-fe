import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export const metadata = {
  title: {
    template: "%s | Kaderisasi Salman",
    default: "Kaderisasi Salman",
  },
  description:
    "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman. Program pembinaan dalam rangka membentuk kader teladan untuk membangun Indonesia.",
  openGraph: {
    title: "Kaderisasi Salman",
    description:
      "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman. Program pembinaan dalam rangka membentuk kader teladan untuk membangun Indonesia.",
    type: "website",
    siteName: "Kaderisasi Salman",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
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
