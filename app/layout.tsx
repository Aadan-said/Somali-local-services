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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased font-sans`} suppressHydrationWarning>
        <ClientSessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
