import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventário TI",
  description: "Gestão corporativa de ativos de TI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
