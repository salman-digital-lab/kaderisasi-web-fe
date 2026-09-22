import type { ReactElement, ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import BrowserChrome from "./BrowserChrome";
import classes from "./SiteLayout.module.css";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <div className={classes.shell}>
      <BrowserChrome />
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
