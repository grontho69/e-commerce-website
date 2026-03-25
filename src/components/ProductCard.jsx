"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, Heart, Eye, ShoppingCart, Star } from "lucide-react";
import Price from "./Price";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { toast } from "sonner";
import gsap from "gsap";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const cardRef = useRef(null);
  const actionsRef = useRef(null);

  const isFavorited = isInWishlist(product.slug);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    addToCart(product, 1, size);
    toast.success(`${product.title} added!`, {
      style: { backgroundColor: '#000', color: '#fff', fontWeight: 'bold' },
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success("Added to Vault", {
        icon: <Heart className="h-4 w-4 fill-black text-black" />,
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(actionsRef.current, { y: 15, opacity: 0 });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const onMouseEnter = () => {
    gsap.to(actionsRef.current, { 
      y: 0, 
      opacity: 1, 
      duration: 0.5, 
      ease: "power3.out" 
    });
  };

  const onMouseLeave = () => {
    gsap.to(actionsRef.current, { 
      y: 10, 
      opacity: 0, 
      duration: 0.3, 
      ease: "power2.in" 
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative bg-white flex flex-col transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop")}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.price > 3000 && (
            <span className="bg-black text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <Star size={8} fill="currentColor" /> Signature
            </span>
          )}
          <span className="bg-white text-black text-[8px] font-black px-3 py-1.5 uppercase tracking-widest shadow-md">
            {product.tier || 'New'}
          </span>
        </div>

        {/* Wishlist Button (Always visible on mobile, hover on desktop) */}
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 pointer-events-auto w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-black hover:text-black transition-transform hover:scale-110 active:scale-95"
        >
          <Heart size={14} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-black" : ""} />
        </button>

        {/* Bottom Actions - Visible on hover desktop */}
        <div 
          ref={actionsRef}
          className="absolute bottom-4 left-4 right-4 flex gap-2 lg:opacity-0 lg:translate-y-4 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
        >
          <button 
            onClick={handleQuickAdd}
            className="pointer-events-auto flex-grow h-10 bg-black text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Quick Add
          </button>
        </div>
      </div>
      
      <div className="pt-5 pb-3 px-1 flex flex-col flex-1">
        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 text-center md:text-left">
          {product.category || "Apparel"}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm md:text-base font-bold text-black hover:text-neutral-500 transition-colors line-clamp-1 uppercase tracking-tight text-center md:text-left">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-3 flex items-center justify-center md:justify-start gap-4">
          <Price amount={product.price} className="text-base font-black text-black tracking-tighter" />
          {product.compareAtPrice && product.compareAtPrice > product.price && (
             <Price amount={product.compareAtPrice} className="text-sm font-bold text-neutral-300 line-through tracking-tighter" />
          )}
        </div>
      </div>
    </div>
  );
}
