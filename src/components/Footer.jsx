import Container from "./Container";
import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, ExternalLink, Send, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-24 border-t border-neutral-900 relative">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20 relative z-10">
          {/* Brand Identity */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="group flex flex-col">
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                VOLANS
                <span className="text-primary">.</span>
              </h2>
              <span className="text-[8px] font-bold tracking-[0.3em] text-neutral-500 mt-1 group-hover:text-primary transition-colors duration-500 uppercase">Premium Edition</span>
            </Link>
            <p className="text-neutral-500 text-xs font-medium leading-relaxed max-w-sm uppercase tracking-wider">
              The pinnacle of contemporary fashion culture. <br /> Limited-run silhouettes for the high-energy modern society.
            </p>
            <div className="flex items-center space-x-3">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <Link key={idx} href="#" className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-primary hover:text-black transition-all border border-neutral-800/50 group">
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:col-start-7 space-y-8">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] italic">Archive</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <li><Link href="/products" className="hover:text-primary transition-all flex items-center group">
                <div className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all" />
                All Products
              </Link></li>
              <li><Link href="/products?filter=new" className="hover:text-primary transition-all flex items-center group">
                <div className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all" />
                New Arrivals
              </Link></li>
              <li><Link href="/products?category=eid" className="hover:text-primary transition-all flex items-center group">
                <div className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all" />
                Eid Essentials
              </Link></li>
              <li><Link href="/products?filter=exclusive" className="hover:text-primary transition-all flex items-center group">
                <div className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all" />
                Signature Series
              </Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">Join for limited-drop access and society event news.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-lg px-4 text-xs text-white focus:outline-none focus:border-primary transition-all"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-neutral-900 flex flex-col lg:flex-row justify-between items-center gap-8 relative z-10">
          <p className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest">
            © 2026 Volans. All Rights Reserved. Crafted with Intent in BD.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="h-8 px-4 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center"><span className="text-[8px] font-bold text-white tracking-widest uppercase">Visa</span></div>
             <div className="h-8 px-4 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center"><span className="text-[8px] font-bold text-white tracking-widest uppercase">bKash</span></div>
             <div className="h-8 px-4 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center"><span className="text-[8px] font-bold text-white tracking-widest uppercase">Nagad</span></div>
          </div>
        </div>
      </Container>
    </footer>

  );
}
