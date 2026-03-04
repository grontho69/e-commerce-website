"use client";
import Container from "@/components/Container";
import { useWishlist } from "@/components/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="pt-32 pb-40 min-h-screen bg-background">
      <Container>
        <FadeIn direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-border/10 pb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-px bg-secondary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Saved Collections</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                Your <span className="text-secondary italic">Archive</span>
              </h1>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic mb-2 opacity-50">Protocol: Storage</span>
               <p className="text-secondary font-black italic uppercase tracking-widest text-lg">
                 {wishlistCount} Assets Preserved
               </p>
            </div>
          </div>
        </FadeIn>

        {wishlistCount > 0 ? (
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
              {wishlist.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </StaggerContainer>
        ) : (
          <FadeIn delay={0.2}>
            <div className="py-32 flex flex-col items-center text-center max-w-lg mx-auto">
              <div className="w-40 h-40 bg-muted/20 border border-border/10 rounded-[3.5rem] flex items-center justify-center text-muted-foreground mb-12 shadow-2xl shadow-primary/5">
                <Heart size={80} strokeWidth={1} />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-primary mb-6">
                Archive Void
              </h2>
              <p className="text-muted-foreground font-medium italic mb-12 leading-relaxed">
                Your personal collection is currently empty. Explore our latest drops to preserve your favorite silhouettes in the archive.
              </p>
              <Link href="/products">
                <Button size="lg" className="h-20 px-16 rounded-[2rem] font-black uppercase tracking-widest italic group bg-primary text-secondary">
                  Explore Catalog <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" size={24} />
                </Button>
              </Link>
            </div>
          </FadeIn>
        )}
      </Container>
    </div>

  );
}
