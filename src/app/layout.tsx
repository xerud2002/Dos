import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://daiostea.ro"),
  title: {
    default: "daiostea.ro - Recenzii Transport România | Verifică Furnizori",
    template: "%s | daiostea.ro"
  },
  description: "Platformă de recenzii pentru servicii de transport în România. Verifică, evaluează și compară furnizori de transport. Citește recenzii reale de la clienți.",
  keywords: [
    "recenzii transport",
    "transport România",
    "furnizori transport",
    "firme transport",
    "rating transport",
    "pareri transport",
    "transport marfa",
    "curierat România",
    "mutari mobila",
    "transport colete",
    "daiostea",
    "review transport"
  ],
  authors: [{ name: "daiostea.ro" }],
  creator: "daiostea.ro",
  publisher: "daiostea.ro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://daiostea.ro",
    siteName: "daiostea.ro",
    title: "daiostea.ro - Recenzii Transport România",
    description: "Platformă de recenzii pentru servicii de transport în România. Verifică, evaluează și compară furnizori de transport.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "daiostea.ro - Recenzii Transport România",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "daiostea.ro - Recenzii Transport România",
    description: "Platformă de recenzii pentru servicii de transport în România",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://daiostea.ro",
  },
  category: "transport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/ico-red.png" />
        <link rel="apple-touch-icon" href="/icons/ico-red-1024x1024.png" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="google-site-verification" content="" />
      </head>
      <body className={`${inter.variable} antialiased bg-slate-50 dark:bg-slate-900 min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
