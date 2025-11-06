import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Next App",
  description: "Using Tailwind v3 + Dark Mode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#f5f2fa] dark:bg-slate-950">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* <div className=" hidden sm:flex ">
            <Sidebar />
          </div> */}
          <main className="min-h-screen transition-all duration-300">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
