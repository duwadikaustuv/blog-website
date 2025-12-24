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

export const metadata: Metadata = {
  title: "ClearMargin - Thoughtful Writing for People Who Build Things",
  description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
  keywords: ["blog", "leadership", "personal growth", "work", "clear thinking"],
  authors: [{ name: "ClearMargin" }],
  openGraph: {
    title: "ClearMargin - Thoughtful Writing for People Who Build Things",
    description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearMargin - Thoughtful Writing for People Who Build Things",
    description: "Essays and short reads on leadership, personal growth, and doing better work without the noise.",
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
