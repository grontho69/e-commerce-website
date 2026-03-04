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
  const db = await getDb();
  const rawProducts = await db.collection("products").find({}).limit(8).toArray();
  const products = JSON.parse(JSON.stringify(rawProducts));

  // AAZBD Inspired Categories
  const categoryTiles = [
    { name: "DROP SHOULDER", href: "/products?search=drop", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" },
    { name: "SIGNATURE WEAR", href: "/products?filter=exclusive", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
    { name: "BASIC ESSENTIALS", href: "/products?filter=budget", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
    { name: "PRINTED SERIES", href: "/products?search=printed", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop" },
    { name: "LIFESTYLE", href: "/products?category=unisex", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop" },
    { name: "SWEATPANTS", href: "/products?category=bottom", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section - Carousel */}
      <HeroCarousel />

      {/* Category Grid */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
           <div className="flex items-center space-x-4 mb-8 md:mb-12">
              <div className="w-8 md:w-12 h-1 bg-primary rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black">Shop by <span className="text-neutral-500">Category</span></h2>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categoryTiles.map((tile, idx) => (
                <FadeIn key={idx} delay={0.1 * idx} direction="up">
                   <Link href={tile.href} className="group flex flex-col items-center">
                      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-3 md:mb-4 border border-neutral-100 transition-all duration-500 hover:shadow-xl">
                         <Image 
                           src={tile.image} 
                           alt={tile.name} 
                           fill 
                           className="object-cover transition-transform duration-1000 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                         <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                            <Button variant="secondary" size="sm" className="w-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest h-7 md:h-8 rounded-lg">View Series</Button>
                         </div>
                      </div>
                      <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-black group-hover:text-primary transition-all text-center">{tile.name}</h3>
                   </Link>
                </FadeIn>
              ))}
           </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32 bg-neutral-50 border-y border-neutral-100">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-6 md:gap-8">
            <div className="relative">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                <div className="w-8 md:w-12 h-0.5 bg-primary" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-500">Curated Selection</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase text-black">
                Most <span className="text-primary italic">Wanted</span>
              </h2>
            </div>
            <Link href="/products" className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl border-2 border-black text-black font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-black hover:text-white transition-all">
                The Full Collection <ArrowRight className="ml-3 md:ml-4" size={16} />
              </Button>
            </Link>
          </div>

          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </StaggerContainer>
        </Container>
      </section>

      {/* Signature Highlight */}
      <section className="py-20 md:py-32 bg-white overflow-hidden relative">
        <Container>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <FadeIn direction="right">
                 <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-100">
                    <Image 
                       src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop" 
                       alt="Signature Series" 
                       fill 
                       className="object-cover"
                    />
                    <div className="absolute top-6 left-6 md:top-10 md:left-10">
                       <div className="bg-primary/95 backdrop-blur-md px-6 py-8 md:px-8 md:py-10 rounded-2xl shadow-xl border border-white/20">
                          <h4 className="text-white text-[8px] font-bold uppercase tracking-widest mb-2 opacity-80">Verified Origin</h4>
                          <p className="text-white text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight">Volans <br />Premium</p>
                       </div>
                    </div>
                 </div>
              </FadeIn>
              <FadeIn direction="left">
                 <div className="space-y-6 md:space-y-10">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] text-black">
                      Refine Your <br className="hidden md:block" /> 
                      <span className="text-primary italic">Identity</span>
                    </h3>
                    <p className="text-neutral-500 font-medium leading-relaxed text-base md:text-lg max-w-lg">
                       Our Signature Series represents the pinnacle of craft, blending intentional silhouettes with high-integrity materials.
                    </p>
                    <div className="grid grid-cols-2 gap-8 md:gap-12 pt-2 md:pt-4">
                       <div className="space-y-1">
                          <span className="text-4xl md:text-5xl font-bold text-black tracking-tight">100%</span>
                          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pure Cotton</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-4xl md:text-5xl font-bold text-primary tracking-tight">HQ</span>
                          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-neutral-400">Elite Craft</p>
                       </div>
                    </div>
                    <Link href="/products?filter=exclusive" className="inline-block pt-4 md:pt-8 w-full md:w-auto">
                       <Button size="lg" className="w-full md:w-auto rounded-xl h-14 md:h-16 px-10 md:px-12 font-bold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all text-xs">Explore Series</Button>
                    </Link>
                 </div>
              </FadeIn>
           </div>
        </Container>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-24 bg-neutral-50 border-t border-neutral-100">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 group transition-all hover:shadow-lg">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                <Truck size={20} className="text-neutral-500 group-hover:text-current md:hidden" />
                <Truck size={28} className="text-neutral-500 group-hover:text-current hidden md:block" />
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Fast Delivery</h4>
                <p className="text-[8px] md:text-[9px] text-neutral-400 font-medium uppercase mt-0.5 md:mt-1 tracking-wider">Nationwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 group transition-all hover:shadow-lg">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                <ShieldCheck size={20} className="text-neutral-500 group-hover:text-current md:hidden" />
                <ShieldCheck size={28} className="text-neutral-500 group-hover:text-current hidden md:block" />
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Secure Vault</h4>
                <p className="text-[8px] md:text-[9px] text-neutral-400 font-medium uppercase mt-0.5 md:mt-1 tracking-wider">Payments</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 group transition-all hover:shadow-lg">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                <ShoppingBag size={20} className="text-neutral-500 group-hover:text-current md:hidden" />
                <ShoppingBag size={28} className="text-neutral-500 group-hover:text-current hidden md:block" />
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Elite Stock</h4>
                <p className="text-[8px] md:text-[9px] text-neutral-400 font-medium uppercase mt-0.5 md:mt-1 tracking-wider">Curated</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-100 group transition-all hover:shadow-lg">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                <Star size={20} className="text-neutral-500 group-hover:text-current md:hidden" />
                <Star size={28} className="text-neutral-500 group-hover:text-current hidden md:block" />
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black">Top Quality</h4>
                <p className="text-[8px] md:text-[9px] text-neutral-400 font-medium uppercase mt-0.5 md:mt-1 tracking-wider">Fabric</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </div>

  );
}
