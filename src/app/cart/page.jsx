"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import Container from "@/components/Container";
import Price from "@/components/Price";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/Motion";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const deliveryFee = subtotal > 5000 ? 0 : 60; 
  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-40 min-h-screen bg-neutral-50">
        <Container>
          <FadeIn direction="up">
            <div className="flex flex-col items-center justify-center text-center py-32 bg-white rounded-3xl border border-neutral-100 shadow-sm">
              <div className="w-24 h-24 bg-neutral-50 flex items-center justify-center rounded-2xl mb-8 border border-neutral-100">
                <ShoppingBag size={40} className="text-neutral-300" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-black">Your bag is empty</h1>
              <p className="text-neutral-500 mb-10 max-w-sm font-medium leading-relaxed text-sm">
                Looks like you haven't added anything to your cart yet. Explore our latest collection to find something special.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-xl px-12 h-14 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all">
                  Explore Collection <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </Container>
      </div>
    );
  }


  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <FadeIn direction="down">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-10">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-0.5 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Your Selection</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase text-black">
                Shopping <span className="text-primary italic">Bag</span>
              </h1>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-all mb-2">
               <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <StaggerContainer>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={`${item.slug}-${item.selectedSize}`} className="flex flex-col sm:flex-row items-center bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="relative w-32 h-40 md:w-36 md:h-44 rounded-xl overflow-hidden mb-6 sm:mb-0 shrink-0 border border-neutral-50">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="sm:ml-8 flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="text-center sm:text-left">
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{item.category}</p>
                          <h3 className="font-bold text-lg md:text-xl text-black uppercase tracking-tight">{item.title}</h3>
                        </div>
                        <div className="flex flex-col md:items-end text-center md:text-right">
                           <Price amount={item.price * item.qty} className="font-bold text-xl text-black" />
                           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">৳{item.price} each</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-6 font-bold uppercase text-[9px] tracking-widest text-neutral-400">
                        {item.selectedSize && (
                          <div className="px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100 text-black">
                             SIZE: {item.selectedSize}
                          </div>
                        )}
                        <div className="px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100">
                           IN STOCK
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-neutral-50 rounded-lg p-1 border border-neutral-100">
                          <button 
                            onClick={() => updateQuantity(item.slug, item.selectedSize, item.qty - 1)} 
                            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:text-primary transition-all active:scale-95 shadow-sm"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-black">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.slug, item.selectedSize, item.qty + 1)} 
                            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:text-primary transition-all active:scale-95 shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.slug, item.selectedSize)} 
                          className="flex items-center space-x-2 text-neutral-300 hover:text-red-500 transition-all text-[9px] font-bold uppercase tracking-widest"
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StaggerContainer>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <FadeIn direction="left" delay={0.4}>
              <div className="bg-black p-8 md:p-10 rounded-3xl text-white shadow-xl sticky top-28">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-8 border-b border-white/10 pb-4">Order Summary</h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center text-neutral-400">
                     <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                     <Price amount={subtotal} className="font-bold text-base text-white" />
                  </div>
                  <div className="flex justify-between items-center text-neutral-400">
                     <span className="text-[10px] font-bold uppercase tracking-widest">Delivery Fee</span>
                     {deliveryFee === 0 ? (
                       <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Free</span>
                     ) : (
                       <Price amount={deliveryFee} className="font-bold text-base text-white" />
                     )}
                  </div>
                  <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Total Amount</span>
                     <Price amount={grandTotal} className="font-bold text-5xl text-white tracking-tight leading-none" />
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary text-black hover:bg-white transition-all shadow-lg shadow-primary/10">
                    Checkout Now <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>

                <div className="space-y-4 pt-8 border-t border-white/5 mt-8">
                   {[
                     { icon: Truck, label: "Fast Nationwide Delivery" },
                     { icon: ShieldCheck, label: "Secure Payment Gateway" },
                     { icon: Zap, label: "Free Shipping Above ৳5000" }
                   ].map((badge, idx) => (
                     <div key={idx} className="flex items-center space-x-3 text-neutral-500 group">
                        <badge.icon size={16} className="text-neutral-400 group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{badge.label}</span>
                     </div>
                   ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
