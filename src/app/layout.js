import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { FocusProvider } from "@/context/FocusContext";
import { SelectionProvider } from "@/context/SelectionContext";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-hidden`}>
        <SelectionProvider>
          <FocusProvider>
            {/* The wrapper is a flex container that fills the screen */}
            <div className="flex h-screen w-screen overflow-hidden">

              {/* SIDEBAR: Stays on the left */}
              <Sidebar />

              {/* MAIN CONTENT: Fills the remaining space */}
              <main className="flex-1 relative bg-[#050505] min-w-0 overflow-hidden">
                {children}

                {/* LOGO: Fixed relative to the MAIN area, not the whole window */}
                <div className="absolute top-6 right-6 z-50 pointer-events-none">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-32 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto"
                  />
                </div>
              </main>

            </div>
          </FocusProvider>
        </SelectionProvider>
      </body>
    </html>
  );
}