"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import Price from "@/components/Price";
import { Check, Wallet, CreditCard, Banknote, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentPage() {
  const { cart, subtotal, clearCart, isInitialized } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ trxId: "", senderNumber: "" });

  useEffect(() => {
    const saved = sessionStorage.getItem("shippingAddress");
    if (saved) {
      setShippingAddress(JSON.parse(saved));
    }
  }, []);

  const deliveryFee = subtotal > 5000 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee;

  const methods = [
    { id: "cod", name: "Cash on Delivery", icon: <Banknote size={24} />, description: "Pay on delivery.", instructions: "Pay to the delivery agent when you verify the items." },
    { id: "bkash", name: "bKash Transfer", icon: <Wallet size={24} />, description: "Merchant: 01800-000000", instructions: "Please Send Money to our merchant account and provide the Transaction ID." },
    { id: "nagad", name: "Nagad Transfer", icon: <Wallet size={24} />, description: "Merchant: 01700-000000", instructions: "Please Send Money to our merchant account and provide the Transaction ID." },
  ];

  const placeOrder = async () => {
    if (paymentMethod !== "cod" && (!paymentDetails.trxId || !paymentDetails.senderNumber)) {
      toast.error("Details Required", { description: "Please provide TrxID and Sender Number for verification." });
      return;
    }

    setIsPlacingOrder(true);
    
    const orderData = {
      items: cart.map(i => ({ 
        productSlug: i.slug, 
        title: i.title, 
        price: i.price, 
        qty: i.qty,
        selectedSize: i.selectedSize 
      })),
      totals: { subtotal, deliveryFee, grandTotal },
      shippingAddress,
      paymentMethod,
      paymentDetails: paymentMethod === "cod" ? null : paymentDetails,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Order placed successfully!");
        
        sessionStorage.removeItem("shippingAddress");
        clearCart();
        router.push(`/checkout/success?orderId=${data._id}`);
      } else {
        toast.error("Failed to place order");
        setIsPlacingOrder(false);
      }
    } catch (error) {
      toast.error("An error occurred");
      setIsPlacingOrder(false);
    }
  };

  const selectedMethod = methods.find(m => m.id === paymentMethod);

  if (!isInitialized || !shippingAddress) {
    return (
      <div className="pt-32 pb-40 min-h-screen bg-neutral-50">
        <Container>
           <div className="flex flex-col items-center justify-center py-32 animate-pulse">
             <h2 className="text-3xl font-bold text-black uppercase tracking-widest">Loading...</h2>
             <p className="text-neutral-400 mt-6 text-[10px] font-bold uppercase tracking-widest">Please wait a moment</p>
           </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <FadeIn direction="down">
          <div className="flex flex-col items-center mb-16 underline-offset-8">
             <Link href="/checkout" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-all mb-8">
                <ArrowLeft size={16} />
                <span>Back to Shipping</span>
             </Link>
             <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-black text-center">Payment</h1>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          {/* Method Selector */}
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {methods.map((method) => (
                <div 
                  key={method.id} 
                  className={`cursor-pointer transition-all duration-500 rounded-3xl p-6 md:p-8 border-2 flex flex-col items-center text-center gap-4 ${
                    paymentMethod === method.id 
                    ? "border-black bg-black text-white shadow-xl scale-[1.02]" 
                    : "border-neutral-100 bg-white text-black hover:border-neutral-300"
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    paymentMethod === method.id 
                    ? "bg-primary text-black" 
                    : "bg-neutral-50 text-neutral-400"
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-tight">{method.name}</h3>
                    <p className={`text-[9px] font-medium mt-1 opacity-60 leading-relaxed uppercase tracking-widest`}>{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </StaggerContainer>

          {/* Details & Submission */}
          <FadeIn direction="up">
             <div className="bg-white p-8 md:p-16 rounded-3xl text-black shadow-sm border border-neutral-100 relative overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-12">
                   <div className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-neutral-400 font-bold uppercase tracking-widest text-[9px]">
                         <Lock size={12} className="opacity-50" />
                         <span>SSL Secure Payment</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black">{selectedMethod?.name}</h3>
                      <p className="text-xs md:text-sm font-medium text-neutral-500 leading-relaxed">{selectedMethod?.instructions}</p>
                   </div>

                   {paymentMethod !== "cod" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Sender Phone</label>
                         <input 
                           type="text" 
                           placeholder="01XXXXXXXXX"
                           className="w-full h-12 bg-neutral-50 border border-neutral-100 rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-primary transition-all text-black"
                           value={paymentDetails.senderNumber}
                           onChange={(e) => setPaymentDetails({ ...paymentDetails, senderNumber: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Transaction ID</label>
                         <input 
                           type="text" 
                           placeholder="Enter TrxID"
                           className="w-full h-12 bg-neutral-50 border border-neutral-100 rounded-lg px-4 text-sm font-medium focus:outline-none focus:border-primary transition-all text-black"
                           value={paymentDetails.trxId}
                           onChange={(e) => setPaymentDetails({ ...paymentDetails, trxId: e.target.value })}
                         />
                      </div>
                    </div>
                   )}

                   <div className="pt-12 border-t border-neutral-100 flex flex-col items-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Grand Total</p>
                      <Price amount={grandTotal} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-black tracking-tighter mb-12 leading-none" />
                      
                      <Button 
                        onClick={placeOrder} 
                        disabled={isPlacingOrder}
                        className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-black/5 bg-black text-white hover:bg-neutral-800 transition-all"
                      >
                        {isPlacingOrder ? (
                          <div className="flex items-center gap-3">
                             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                             <span>Processing...</span>
                          </div>
                        ) : `Complete Order`}
                      </Button>
                      
                      <div className="mt-8 flex items-center space-x-4 opacity-40 text-[9px] font-bold uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-black" />
                        <span>SSL Secured Transaction</span>
                      </div>
                   </div>
                </div>
             </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
