import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PLAUSIBLE — Retos y limitaciones de los LLM en la práctica clínica",
  description:
    "Demostración interactiva y presentación académica sobre fluidez vs. fiabilidad clínica en Modelos de Lenguaje Grande. Universidad Icesi.",
  authors: [
    { name: "Jose Miguel Armas" },
    { name: "Luis Felipe Cadena" },
  ],
  keywords: [
    "LLM",
    "Práctica clínica",
    "Alucinaciones",
    "Loros estocásticos",
    "Medicina",
    "Icesi",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#070A0F] text-[#E6EDF3] antialiased selection:bg-[#2DD4BF]/20 selection:text-[#2DD4BF] bg-grain">
        {children}
      </body>
    </html>
  );
}
