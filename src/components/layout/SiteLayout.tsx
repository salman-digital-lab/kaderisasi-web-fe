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
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
