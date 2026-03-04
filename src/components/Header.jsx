"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut, Search, Heart, Truck, Phone, Sparkles, LayoutDashboard, MapPin, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useSession, signOut } from "next-auth/react";
import Container from "./Container";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist ? useWishlist() : { wishlistCount: 0 };
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // GSAP Entrance
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { y: -20, opacity: 0, duration: 1, ease: "expo.out" });
      // Removed nav-link animation to fix visibility issues
      gsap.from(".action-item", { scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)", delay: 0.4 });
    }, headerRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "ALL PRODUCTS", href: "/products" },
    { name: "NEW IN", href: "/products?filter=new" },
    { name: "EID COLLECTION", href: "/products?category=eid" },
    { name: "Most Wanted", href: "/products?filter=trending" },
    { name: "Budget Pick", href: "/products?filter=budget" },
    { name: "Signature Series", href: "/products?filter=exclusive" },
  ];

  return (
    <>
      <div className={`bg-black text-[10px] font-bold uppercase tracking-[0.2em] py-2 transition-all duration-500 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-auto opacity-100"}`}>
        <Container>
          <div className="flex justify-between items-center text-white/90">
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><Truck size={12} className="text-primary" /> Free Shipping on BDT 5000+</span>
                <span className="hidden md:flex items-center gap-2"><MapPin size={12} className="text-primary" /> Worldwide delivery</span>
             </div>
             <div className="flex items-center gap-6">
                <Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
                <div className="h-3 w-px bg-white/20" />
                <span className="text-primary">Hotline: +880 1700-000000</span>
             </div>
          </div>
        </Container>
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 transition-all duration-700 ${
          isScrolled 
          ? "bg-white/80 backdrop-blur-xl py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] border-b border-neutral-100" 
          : "bg-white py-6 md:py-8"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between gap-8">
            <Link href="/" ref={logoRef} className="shrink-0 flex items-center group relative z-10">
               <div className="flex flex-col">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black uppercase leading-none">
                    VOLANS
                    <span className="text-primary">.</span>
                  </h1>
                  <span className="text-[8px] font-bold tracking-[0.3em] text-neutral-400 mt-0.5 group-hover:text-primary transition-colors duration-500 text-center">PREMIUM</span>
               </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative group ${
                    pathname === link.href ? "text-primary" : "text-black"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {pathname === link.href && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" 
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 origin-left" />
                </Link>
              ))}
            </nav>

            <div ref={actionsRef} className="flex items-center gap-3">
              <div className="hidden xl:flex relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-all" size={14} />
                <input 
                  type="text"
                  placeholder="SEARCH ARCHIVE..."
                  onKeyDown={handleSearch}
                  className="w-32 h-10 bg-neutral-50 border border-neutral-100 rounded-full pl-10 pr-4 text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:bg-white focus:border-primary/50 focus:w-48 transition-all placeholder:text-neutral-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <Link href="/wishlist" className="action-item relative p-2.5 text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-full transition-all">
                  <Heart size={20} className={mounted && wishlistCount > 0 ? "fill-primary text-primary border-none" : ""} />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[8px] font-black text-white flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="action-item relative p-2.5 text-neutral-700 hover:text-primary hover:bg-neutral-50 rounded-full transition-all">
                  <ShoppingBag size={20} />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-black text-[8px] font-black text-white flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="h-6 w-px bg-neutral-100 mx-1 hidden md:block" />

              {status === "loading" ? (
                <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse hidden md:block" />
              ) : session ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="action-item flex items-center gap-2 p-1.5 pr-3 rounded-full bg-neutral-50 border border-neutral-100 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden">
                       {session.user.image ? (
                          <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-primary text-[10px] font-black">{session.user.name.charAt(0).toUpperCase()}</span>
                       )}
                    </div>
                    <ChevronDown size={14} className={`text-neutral-400 group-hover:text-primary transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100 p-5 z-[60]"
                      >
                         <div className="pb-4 mb-4 border-b border-neutral-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black">{session.user.name}</p>
                            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest truncate">{session.user.email}</p>
                         </div>
                         <nav className="space-y-1">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-700 transition-colors">
                               <User size={14} /> Account Settings
                            </Link>
                            {session.user.role === 'admin' && (
                               <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary transition-colors">
                                  <LayoutDashboard size={14} /> Admin Dashboard
                               </Link>
                            )}
                            <button 
                              onClick={() => signOut()}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors mt-2"
                            >
                               <LogOut size={14} /> Sign Out
                            </button>
                         </nav>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                   <Link href="/login">
                      <Button variant="ghost" className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all font-bold">
                        Log In
                      </Button>
                   </Link>
                   <Link href="/register">
                      <Button className="h-10 px-6 rounded-full bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 transition-all font-bold">
                        Register
                      </Button>
                   </Link>
                </div>
              )}

              <div className="lg:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <button className="p-2 hover:bg-neutral-50 rounded-full transition-all">
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] border-none p-0 flex flex-col bg-white">
                    <div className="bg-black p-12 text-white flex flex-col gap-2">
                       <SheetTitle className="text-3xl font-black tracking-tighter uppercase text-white">VOLANS<span className="text-primary">.</span></SheetTitle>
                       <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Elite Fashion Archive</p>
                    </div>
                    <nav className="flex flex-col gap-2 p-8 overflow-y-auto">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-xl font-black uppercase tracking-tight py-4 border-b border-neutral-50 hover:text-primary transition-all text-neutral-900"
                        >
                          {link.name}
                        </Link>
                      ))}
                      
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        {session ? (
                           <button 
                             onClick={() => {
                               signOut();
                               setIsMenuOpen(false);
                             }} 
                             className="col-span-2 py-4 rounded-2xl bg-red-50 text-[11px] font-black uppercase tracking-[0.2em] text-red-500"
                           >
                             Sign Out
                           </button>
                        ) : (
                           <>
                              <Link 
                                href="/login" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center py-4 rounded-2xl border-2 border-neutral-100 text-[11px] font-black uppercase tracking-[0.2em]"
                              >
                                Log In
                              </Link>
                              <Link 
                                href="/register" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center py-4 rounded-2xl bg-primary text-[11px] font-black uppercase tracking-[0.2em] text-white"
                              >
                                Register
                              </Link>
                           </>
                        )}
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-[60] hidden lg:block"
          >
            <Link href="/products?category=eid">
              <div className="bg-white/80 backdrop-blur-md text-black py-8 px-4 rounded-r-3xl shadow-2xl flex flex-col items-center gap-8 cursor-pointer hover:pr-8 transition-all group border border-l-0 border-neutral-100">
                 <Sparkles size={20} className="text-primary animate-pulse" />
                 <span className="[writing-mode:vertical-lr] font-black uppercase tracking-[0.5em] text-[10px] rotate-180 whitespace-nowrap">Eid Specials 2026</span>
                 <div className="w-0.5 h-16 bg-neutral-100 rounded-full relative overflow-hidden">
                    <motion.div 
                      animate={{ y: [-64, 64] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-10 bg-primary opacity-50"
                    />
                 </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
