import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Atmos | Weather Intelligence",
  description: "A premium weather intelligence experience for every journey.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-backdrop" aria-hidden="true" />
        <header className="site-header">
          <div className="shell nav-shell">
            <Link href="/" className="brand" aria-label="Atmos home">
              <span className="brand-mark">✦</span>
              <span>atmos</span>
            </Link>
            <nav className="main-nav" aria-label="Primary navigation">
              <Link href="/">Today</Link>
              <Link href="/saved">Saved places</Link>
              <Link href="/about">About</Link>
            </nav>
            <Link href="/saved" className="nav-action" aria-label="Open saved places">⌁</Link>
          </div>
        </header>
        <main className="shell page-shell">{children}</main>
      </body>
    </html>
  );
}
