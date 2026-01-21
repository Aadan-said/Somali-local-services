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
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (theme === 'dark') document.documentElement.classList.add('dark');
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
