import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Arimo, Oswald } from "next/font/google";
import Providers from "./providers";
import { DialogProvider } from "@/context/DialogContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});
const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSJT - Sistema de Saúde de Joaquim Távora - pr",
  description: "Sistema de Saúde de Joaquim Távora - pr",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${arimo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <DialogProvider>
            {children}
          </DialogProvider>
        </Providers>
      </body>
    </html>
  );
}
