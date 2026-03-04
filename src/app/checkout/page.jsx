"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/Motion";
import Price from "@/components/Price";
import { ShieldCheck, Truck, ArrowLeft, Send, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, subtotal, isInitialized } = useCart();
  const router = useRouter();
  const deliveryFee = subtotal > 5000 ? 0 : 60;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Dhaka",
    area: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
    if (isInitialized && cart.length === 0) {
      router.push("/cart");
    }
  }, [status, isInitialized, cart, router]);

  if (status === "loading" || !isInitialized) {
    return (
      <div className="pt-32 pb-40 min-h-screen bg-white">
        <Container>
          <div className="flex flex-col items-center justify-center py-32 animate-pulse">
            <h2 className="text-2xl font-black italic text-slate-200 uppercase tracking-widest">Synchronizing Bag...</h2>
          </div>
        </Container>
      </div>
    );
  }

  if (cart.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error("Required Fields Missing", {
        description: "Please provide your shipping details to continue.",
      });
      return;
    }
    
    sessionStorage.setItem("shippingAddress", JSON.stringify(formData));
    router.push("/payment");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <FadeIn direction="down">
          <div className="flex flex-col items-center mb-16">
             <Link href="/cart" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-all mb-6">
                <ArrowLeft size={16} />
                <span>Back to Bag</span>
             </Link>
             <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-black">Checkout</h1>
          </div>
        </FadeIn>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <FadeIn direction="right" delay={0.2}>
                <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 md:p-12 rounded-2xl border border-neutral-100 shadow-sm">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">1</div>
                       <h2 className="text-2xl font-bold uppercase tracking-tight text-black">Shipping Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Receiver Name</label>
                        <Input name="name" required value={formData.name} onChange={handleChange} placeholder="Enter full name" className="h-12 rounded-lg bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium px-4" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Phone Number</label>
                        <Input name="phone" required value={formData.phone} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" className="h-12 rounded-lg bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium px-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center space-x-4 border-t border-neutral-100 pt-8">
                       <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">2</div>
                       <h2 className="text-2xl font-bold uppercase tracking-tight text-black">Delivery Address</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Full Address</label>
                        <Input name="address" required value={formData.address} onChange={handleChange} placeholder="Street, House, Flat number" className="h-12 rounded-lg bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium px-4" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">City</label>
                          <select 
                            name="city" 
                            required 
                            value={formData.city} 
                            onChange={handleChange}
                            className="w-full h-12 rounded-lg bg-neutral-50 border border-neutral-200 focus:bg-white transition-all text-sm font-medium px-4 appearance-none focus:outline-none cursor-pointer"
                          >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                          </select>
                          <div className="absolute right-4 bottom-3.5 pointer-events-none text-neutral-400">
                             <ChevronDown size={14} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Area / Zip Code</label>
                          <Input name="area" value={formData.area} onChange={handleChange} placeholder="Area or Postcode" className="h-12 rounded-lg bg-neutral-50 border-neutral-200 focus:bg-white transition-all text-sm font-medium px-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all shadow-lg shadow-black/10">
                    Proceed to Payment <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </Button>
                </form>
            </FadeIn>
          </div>

          {/* Order Review */}
          <div className="lg:col-span-5">
            <FadeIn direction="left" delay={0.4}>
                <div className="bg-white p-8 md:p-10 rounded-2xl border border-neutral-100 shadow-sm sticky top-28">
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-8 border-b border-neutral-50 pb-6 text-black">Order Summary</h3>
                  
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8 scrollbar-hide">
                    {cart.map((item, idx) => (
                      <div key={`${item.slug}-${item.selectedSize}`} className="flex justify-between items-start gap-4 pb-6 border-b border-neutral-50 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-20 bg-neutral-50 rounded-lg overflow-hidden shrink-0 border border-neutral-100">
                             <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1 text-black">{item.title}</h4>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{item.qty}x • Size {item.selectedSize || 'Standard'}</p>
                          </div>
                        </div>
                        <Price amount={item.price * item.qty} className="font-bold text-xs text-black" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 border-t border-neutral-50 pt-6">
                    <div className="flex justify-between items-center text-neutral-400">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                       <Price amount={subtotal} className="font-bold text-xs text-black" />
                    </div>
                    <div className="flex justify-between items-center text-neutral-400">
                       <span className="text-[10px] font-bold uppercase tracking-widest">Delivery Fee</span>
                       {deliveryFee === 0 ? (
                         <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Free</span>
                       ) : (
                         <Price amount={deliveryFee} className="font-bold text-xs text-black" />
                       )}
                    </div>
                    <div className="pt-6 mt-6 border-t border-neutral-100 flex justify-between items-end">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Amount</span>
                          <Price amount={subtotal + deliveryFee} className="font-bold text-4xl text-black tracking-tight leading-none" />
                       </div>
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <Truck size={20} className="text-black opacity-40" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <ShieldCheck size={20} className="text-black opacity-40" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">Secure Payment</span>
                    </div>
                  </div>
                </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
