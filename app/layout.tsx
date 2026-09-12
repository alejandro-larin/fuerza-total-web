import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: { default: "Fuerza Total", template: "%s | Fuerza Total" },
  description: "Panel de negocio para la gestión diaria del gimnasio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${manrope.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
