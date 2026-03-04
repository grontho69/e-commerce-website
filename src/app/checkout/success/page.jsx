"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Hash, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import { Suspense } from "react";
import Price from "@/components/Price";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) return (
    <div className="pt-32 pb-40 min-h-screen bg-background flex items-center justify-center">
       <div className="animate-pulse flex flex-col items-center">
          <Clock size={48} className="text-secondary/20 mb-4" />
          <h2 className="text-xl font-black italic text-secondary uppercase tracking-widest text-center">Syncing Receipt...</h2>
       </div>
    </div>
  );

  const isPending = order?.status === "pending_verification";

  return (
    <div className="pt-32 pb-40 bg-background min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn direction="up">
            <div className="flex justify-center mb-12 relative">
               <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all ${isPending ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white animate-bounce'}`}>
                 {isPending ? <Clock size={60} /> : <CheckCircle2 size={60} />}
               </div>
               <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary rotate-12 shadow-xl border-4 border-background">
                  <ShieldCheck size={24} />
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase italic text-primary leading-none">
               Order {isPending ? "Logged" : "Accepted"} <span className="text-secondary italic">!</span>
            </h1>
            
            <p className="text-lg text-primary/60 mb-10 leading-relaxed font-black uppercase tracking-wide italic max-w-xl mx-auto">
              {isPending 
                ? "Your selection is preserved. We are currently verifying your manual payment transaction."
                : "Thank you for choosing the elite society. Your order has been admitted to our logistics queue."
              }
            </p>

            {isPending && (
              <div className="bg-amber-500/10 border-2 border-amber-500/20 px-8 py-6 rounded-[2.5rem] mb-12 flex items-start space-x-6 text-left">
                 <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                 <div>
                    <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm italic mb-2">Payment Verification Required</h3>
                    <p className="text-xs font-bold text-amber-500/70 uppercase leading-relaxed italic">
                       Our administrators are manually checking your TrxID. This typically takes 30-60 minutes during business hours. Once verified, your status will update to "Confirmed".
                    </p>
                 </div>
              </div>
            )}

            {orderId && (
              <div className="bg-primary p-8 rounded-[3rem] border border-white/5 shadow-2xl shadow-primary/20 mb-16 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 -rotate-45 translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-700" />
                 
                 <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center space-x-4 text-left">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary">
                          <Hash size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/40 italic">Reference Node</p>
                          <p className="text-2xl font-black text-secondary italic tracking-tighter">#{orderId.slice(-8).toUpperCase()}</p>
                       </div>
                    </div>
                    
                    <div className="h-px w-12 bg-white/10 hidden md:block" />
                    
                    <div className="text-center md:text-right">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/40 italic">Total Settlement</p>
                       <Price amount={order?.totals?.grandTotal || 0} className="text-4xl font-black text-white italic tracking-tighter" />
                    </div>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/products" className="group">
                <Button size="lg" variant="outline" className="w-full h-20 rounded-[2rem] font-black uppercase italic tracking-[0.2em] border-2 border-border text-primary hover:bg-primary hover:text-secondary transition-all">
                  Return to Archive
                </Button>
              </Link>
              <Link href="/dashboard" className="group">
                <Button size="lg" className="w-full h-20 rounded-[2rem] font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 bg-primary text-secondary hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  Society Dashboard <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-xl font-black italic text-primary uppercase animate-pulse">Initializing Success Node...</div>
       </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
