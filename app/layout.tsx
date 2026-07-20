import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import CookieConsent from "@/components/legal/CookieConsent";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const description =
  "Academia Belfort — Musculação e Cross Training em Belém. Duas unidades, estrutura completa, resultados reais.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Academia Belfort",
    template: "%s | Academia Belfort",
  },
  description,
  keywords: [
    "academia em Belém",
    "musculação Belém",
    "cross training Belém",
    "academia Telégrafo",
    "academia Sacramenta",
    "aula de cortesia academia",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Academia Belfort",
    title: "Academia Belfort",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Academia Belfort",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
