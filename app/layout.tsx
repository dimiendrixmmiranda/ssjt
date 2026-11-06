import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Oswald, Arimo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const arimo = Arimo({
    variable: "--font-arimo-custom",
    subsets: ["latin"],
});

const oswald = Oswald({
    variable: "--font-oswald-custom",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter-custom",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SSJT",
    description: "Sistema de Saúde de Joaquim Távora",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="pt-BR"
            className={`${geistSans.variable} ${geistMono.variable} ${arimo.variable} ${oswald.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}