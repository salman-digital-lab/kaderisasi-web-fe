import { Suspense } from "react";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Suspense>
        <Navbar />
      </Suspense>
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
