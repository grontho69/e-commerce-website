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
  const overlayRef = useRef(null);
  const actionsRef = useRef(null);

  const isFavorited = isInWishlist(product.slug);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    addToCart(product, 1, size);
    toast.success(`${product.title} added!`, {
      style: { backgroundColor: '#FFB22C', color: '#000', fontWeight: 'bold' },
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success("Added to Wishlist", {
        icon: <Heart className="h-4 w-4 fill-red-500 text-red-500" />,
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
    gsap.to(cardRef.current, { 
      y: -8, 
      boxShadow: "0 40px 80px -15px rgba(0,0,0,0.08)", 
      borderColor: "rgba(0,0,0,0.05)",
      duration: 0.6, 
      ease: "expo.out" 
    });
    gsap.to(actionsRef.current, { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      ease: "power3.out" 
    });
  };

  const onMouseLeave = () => {
    gsap.to(cardRef.current, { 
      y: 0, 
      boxShadow: "0 4px 20px -5px rgba(0,0,0,0.03)", 
      borderColor: "rgba(0,0,0,0.02)",
      duration: 0.6, 
      ease: "power3.inOut" 
    });
    gsap.to(actionsRef.current, { 
      y: 10, 
      opacity: 0, 
      duration: 0.4, 
      ease: "power2.in" 
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative bg-white rounded-xl overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-200"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop")}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.price > 3000 && (
            <span className="bg-black text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Star size={8} fill="currentColor" /> Elite
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-md text-black text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-neutral-100">
            {product.tier || 'New'}
          </span>
        </div>

        {/* Actions - Visible on mobile, hover on desktop */}
        <div 
          ref={actionsRef}
          className="absolute bottom-3 left-3 right-3 flex gap-2 lg:opacity-0 lg:translate-y-4 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0"
        >
          <button 
            onClick={handleWishlist}
            className="pointer-events-auto w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center text-black hover:text-red-500 transition-colors"
          >
            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-red-500" : ""} />
          </button>
          
          <button 
            onClick={handleQuickAdd}
            className="pointer-events-auto flex-grow h-9 bg-black text-white font-bold text-[8px] uppercase tracking-widest rounded-lg shadow-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={12} /> Add
          </button>

          <Link 
            href={`/products/${product.slug}`}
            className="pointer-events-auto w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md text-black shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors border border-neutral-100"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>
      
      <div className="p-4 md:p-5">
        <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm md:text-base font-bold text-black hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-2 md:mt-3 flex items-center justify-between">
          <Price amount={product.price} className="text-base md:text-lg font-bold text-black" />
          <Link href={`/products/${product.slug}`} className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold uppercase text-neutral-500 hover:text-black transition-colors">
            Details <MoveRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

