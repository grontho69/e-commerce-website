import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Volans | Premium Bangladeshi Clothing",
  description: "Modern, high-quality clothing delivered across Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster 
            richColors 
            closeButton 
            position="top-right"
            toastOptions={{
              className: "rounded-[1.5rem] border border-border/10 bg-card text-foreground font-black italic text-[10px] uppercase tracking-widest",
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

