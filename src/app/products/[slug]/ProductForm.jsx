"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Check, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ProductForm({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const { addToCart } = useCart();

  const handleAddToCart = (e, shouldRedirect = false) => {
    if (product.sizes && !selectedSize) {
      toast.error("Please select a size", {
        description: "Choose a size that fits you best.",
      });
      return;
    }

    addToCart(product, qty, selectedSize);
    
    if (shouldRedirect) {
      router.push("/cart");
    } else {
      toast.success(`${product.title} added to cart!`, {
        description: `${qty}x items in size ${selectedSize || 'Standard'}.`,
        icon: <Check className="text-green-500" />,
      });
    }
  };

  return (
    <div className="space-y-10">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center group cursor-pointer">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Select Size</h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:gap-3 transition-all">
              <span>Size Guide</span>
              <div className="w-4 h-px bg-primary" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[56px] h-14 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center transform hover:scale-105 active:scale-95 ${
                  selectedSize === size
                    ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5"
                    : "border-neutral-100 bg-neutral-50 text-neutral-400 hover:border-neutral-200 hover:bg-white hover:text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Buy Now Group */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {/* Qty Selector */}
            <div className="flex items-center border border-neutral-100 rounded-xl p-1 bg-neutral-50 sm:w-36 shrink-0">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-neutral-400 hover:text-primary active:scale-95"
                >
                  <Minus size={16} />
                </button>
                <span className="flex-grow text-center font-bold text-sm text-black">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-neutral-400 hover:text-primary active:scale-95"
                >
                  <Plus size={16} />
                </button>
            </div>
            
            {/* Add to Cart */}
            <Button 
              onClick={(e) => handleAddToCart(e, false)}
              size="lg" 
              className="flex-grow h-14 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/5 hover:scale-[1.02] transition-all active:scale-95 bg-white border border-neutral-200 text-black hover:bg-neutral-50"
            >
              <ShoppingBag className="mr-2" size={16} /> Add to bag
            </Button>
        </div>

        {/* Instant Checkout */}
        <Button 
          onClick={(e) => handleAddToCart(e, true)}
          size="lg" 
          className="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.01] transition-all active:scale-95 group bg-black text-white hover:bg-neutral-800"
        >
          <Zap className="mr-2 group-hover:scale-110 transition-transform" size={18} fill="currentColor" /> Express Checkout
        </Button>
      </div>

      {/* Trust & Details */}
      <div className="pt-8 border-t border-neutral-100">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
               <Check size={18} />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-0.5">Availability</p>
               <p className="text-[9px] font-medium text-neutral-400 uppercase tracking-widest">In stock • Ships within 48 hours</p>
            </div>
         </div>
      </div>
    </div>

  );
}
