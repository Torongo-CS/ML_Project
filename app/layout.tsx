import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriCure — AI Powered Plant Pathology Engine",
  description: "Precision foliage diagnostic platform engineered with 150-frame neural video vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#07050E] text-[#F3F0FA] font-sans selection:bg-lime-500/30 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}



