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
  title: "Platform Aktivis Salman ITB (BMKA)",
  description:
    "Portal Aktivis Salman yang dikelola BMKA (Bidang Kemahasiswaan, Kaderisasi dan Alumni) Salman yang berfungsi sebagai pusat pendaftaran kegiatan di @kaderisasisalman. Program pembinaan dalam rangka membentuk kader teladan untuk membangun Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta
          name="google-site-verification"
          content="BhyTMNxi8e9S4lV2NLGSX1QuJSU0GEkGGoIMuJzJIUM"
        />
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
