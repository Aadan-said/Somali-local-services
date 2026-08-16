import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClientSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Somali Local Services",
  description: "Find trusted local services and experts in Somalia.",
};

import { ErrorBoundary } from "@/components/error-boundary";

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
              (function() {
                try {
                  var themeV2 = localStorage.getItem('theme_v2');
                  // If user has not explicitly set theme_v2 to 'dark', enforce LIGHT mode by default
                  if (themeV2 === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    if (!themeV2) {
                      localStorage.setItem('theme_v2', 'light');
                      localStorage.setItem('theme', 'light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

      </head>
      <body className={`${outfit.variable} antialiased font-sans`} suppressHydrationWarning>
        <ErrorBoundary>
          <ClientSessionProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ClientSessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
