import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.webondevices.com"),
  title: {
    default: "Web on Devices: software, hardware and intelligence",
    template: "%s · Web on Devices",
  },
  description:
    "Web on Devices is a creative technology studio designing and building spatial experiences, connected hardware, AI and software.",
};

export const viewport: Viewport = {
  /* Light only for now. To bring dark mode back, restore themeInitScript from lib/theme.ts. */
  themeColor: "#f5f4f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrains.variable}`} data-theme="light">
      <body>{children}</body>
    </html>
  );
}
