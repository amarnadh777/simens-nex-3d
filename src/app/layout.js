import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { FocusProvider } from "@/context/FocusContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <FocusProvider>
          <div className="flex h-screen w-full max-w-full overflow-hidden relative">

            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[#050505] min-w-0">
              {children}
            </main>

            {/* RIGHT LOGO */}
            <img
              src="/logo.png"
              alt="Logo"
              className="fixed top-4 right-4 size-40 opacity-80 hover:opacity-100 transition z-50"
            />

          </div>
        </FocusProvider>
      </body>
    </html>
  );
}
