import type { Metadata } from "next";
import NavBar from "../components/nav-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webmule",
  description: "eMule Web UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Webmule" />
      </head>
      <body className="size-full antialiased">
        <main className="w-full">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
