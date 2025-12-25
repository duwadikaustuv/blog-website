import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXTAUTH_URL || "https://clearmargin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClearMargin - Thoughtful Writing for People Who Build Things",
    template: "%s | ClearMargin",
  },
  description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
  keywords: ["blog", "leadership", "personal growth", "work", "clear thinking", "essays", "productivity"],
  authors: [{ name: "ClearMargin" }],
  creator: "ClearMargin",
  publisher: "ClearMargin",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ClearMargin - Thoughtful Writing for People Who Build Things",
    description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
    url: siteUrl,
    siteName: "ClearMargin",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ClearMargin Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearMargin - Thoughtful Writing for People Who Build Things",
    description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
    images: ["/logo.png"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
