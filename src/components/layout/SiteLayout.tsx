import type { ReactElement, ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div
      style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
