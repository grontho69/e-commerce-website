import Link from "next/link";
import Image from "next/image";
import { getDb } from "@/lib/mongodb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import { 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Star,
  Search,
  Sparkles
} from "lucide-react";

import HeroCarousel from "@/components/HeroCarousel";

export default async function Home() {
  let products = [];
  try {
    const db = await getDb();
    const rawProducts = await db.collection("products").find({}).limit(8).toArray();
    products = JSON.parse(JSON.stringify(rawProducts));
  } catch (error) {
    console.error("Home page build-time DB fetch failed:", error.message);
  }

  // AAZBD Inspired Categories
  const categoryTiles = [
    { name: "DROP SHOULDER", href: "/products?search=drop", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" },
    { name: "SIGNATURE WEAR", href: "/products?filter=exclusive", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
    { name: "BASIC ESSENTIALS", href: "/products?filter=budget", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
    { name: "PRINTED SERIES", href: "/products?search=printed", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Campaign */}
      <section className="py-24 md:py-32 bg-white">
        <Container>
           <FadeIn direction="up">
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 mb-16 md:mb-24">
                 <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Curated Intelligence</h2>
                 <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none">
                    Minimal Form.<br /> <span className="text-neutral-300">Maximum Function.</span>
                 </h1>
                 <p className="text-sm md:text-base font-medium text-neutral-500 max-w-2xl leading-relaxed mt-4">
                    Explore garments engineered for the urban ecosystem. High-intensity materials fused with precision tailoring.
                 </p>
              </div>
           </FadeIn>

           {/* Core 4 Categories Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTiles.map((tile, idx) => (
                <FadeIn key={idx} delay={0.1 * idx} direction="up" className="h-full">
                   <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden bg-neutral-100">
                      <Image 
                        src={tile.image} 
                        alt={tile.name} 
                        fill 
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                         <div className="self-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                               <ArrowRight size={16} />
                            </span>
                         </div>
                         <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white opacity-90 mb-2">Category 0{idx + 1}</h3>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-none">
                               {tile.name}
                            </h2>
                         </div>
                      </div>
                   </Link>
                </FadeIn>
              ))}
           </div>
        </Container>
      </section>

      {/* New Arrivals Slider */}
      <section className="py-20 md:py-32 bg-neutral-50 border-y border-neutral-100">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Latest Inject</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black leading-none">
                New <br/>Arrivals
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-black">
               View Directory <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </StaggerContainer>
        </Container>
      </section>

      {/* Full Width Campaign Banner */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-black overflow-hidden flex items-center justify-center text-center">
         <Image 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" 
            alt="Signature Series Banner" 
            fill 
            className="object-cover opacity-60 mix-blend-overlay"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
         
         <div className="relative z-10 p-6 flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-white mb-8 animate-pulse" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-6">Object 001</h4>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter text-white leading-none mb-10 mix-blend-difference">
               The Core
            </h2>
            <Link href="/products?filter=exclusive">
               <button className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-colors">
                  Acquire Now
               </button>
            </Link>
         </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-b border-black divide-y md:divide-y-0 md:divide-x divide-black">
            <div className="pt-12 md:pt-16 pb-12 md:pb-16 md:px-8 flex flex-col items-center text-center group">
              <Truck size={32} strokeWidth={1.5} className="mb-8 text-black group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-3">Priority Logistics</h4>
              <p className="text-[11px] font-medium leading-relaxed text-neutral-500 max-w-[200px]">Next-day delivery architecture across all major urban zones.</p>
            </div>
            <div className="pt-12 md:pt-16 pb-12 md:pb-16 md:px-8 flex flex-col items-center text-center group">
              <ShieldCheck size={32} strokeWidth={1.5} className="mb-8 text-black group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-3">Secure Vault</h4>
              <p className="text-[11px] font-medium leading-relaxed text-neutral-500 max-w-[200px]">Encrypted transactional pathways. 100% buyer protection guaranteed.</p>
            </div>
            <div className="pt-12 md:pt-16 pb-12 md:pb-16 md:px-8 flex flex-col items-center text-center group">
              <Zap size={32} strokeWidth={1.5} className="mb-8 text-black group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-3">Elite Quality</h4>
              <p className="text-[11px] font-medium leading-relaxed text-neutral-500 max-w-[200px]">Garments engineered to outlast cyclical trends. Verified integrity.</p>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
}
