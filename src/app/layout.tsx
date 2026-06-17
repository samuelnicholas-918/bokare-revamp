import type { Metadata, Viewport } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Providers } from "@/components/Providers";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Bokare.in — B.Com Business Economics Resources",
    template: "%s | Bokare.in",
  },
  description:
    "Study resources for B.Com Business Economics — lecture notes, PDFs, question banks, and more across all semesters.",
  keywords: ["business economics", "B.Com", "economics", "study resources", "bokare"],
  openGraph: {
    title: "Bokare.in — Business Economics Learning",
    description: "Empowering B.Com students with organized economics study resources.",
    url: "https://bokare.in",
    siteName: "Bokare.in",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1218" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} min-h-screen font-sans antialiased`}
      >
        <Providers>
          <AnalyticsTracker />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
