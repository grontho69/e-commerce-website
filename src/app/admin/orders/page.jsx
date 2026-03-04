"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import { 
  CheckCircle2, XCircle, Search, Clock, 
  CreditCard, Phone, Hash, Banknote,
  ArrowRight, ShieldCheck, Filter
} from "lucide-react";
import Price from "@/components/Price";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending_verification");

  useEffect(() => {
    if (session && session.user.role !== "admin") {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [session, router, filter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const verifyOrder = async (id, action) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(`Order ${action}ed`);
        setOrders(orders.map(o => o._id === id ? { 
          ...o, 
          status: action === "verify" ? "placed" : "payment_failed",
          paymentStatus: action === "verify" ? "paid" : "rejected" 
        } : o));
      } else {
        toast.error("Process failed");
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  if (loading) return (
    <div className="pt-32 pb-40 min-h-screen bg-background">
      <Container>
         <div className="flex flex-col items-center justify-center py-32 animate-pulse">
           <h2 className="text-2xl font-black italic text-secondary uppercase tracking-widest">Accessing Ledger...</h2>
         </div>
      </Container>
    </div>
  );

  const filteredOrders = orders.filter(o => filter === "all" ? true : o.status === filter);

  return (
    <div className="pt-24 pb-32 bg-background min-h-screen">
      <Container>
        <FadeIn direction="down">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
             <div className="space-y-4">
               <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60 italic">
                  <ShieldCheck size={14} />
                  <span>Administrative Authority Node</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-primary">Order <span className="text-secondary italic">Ledger</span></h1>
             </div>
             
             <div className="flex items-center gap-3 bg-card p-2 rounded-2xl border border-border shadow-2xl">
                {[
                  { id: "pending_verification", label: "Pending" },
                  { id: "placed", label: "Active" },
                  { id: "all", label: "Archive" }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${
                      filter === f.id ? "bg-primary text-secondary" : "hover:bg-primary/5 text-primary/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>
          </div>
        </FadeIn>

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="py-32 text-center bg-card rounded-[3rem] border border-border/50">
               <Clock size={48} className="mx-auto text-secondary/20 mb-6" />
               <p className="text-sm font-black uppercase tracking-widest text-primary/40 italic">No orders matching protocol</p>
            </div>
          ) : (
            <StaggerContainer>
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-card rounded-[2.5rem] border border-border/50 p-8 hover:border-primary transition-all duration-500 overflow-hidden group">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Summary */}
                        <div className="lg:col-span-3 space-y-4">
                           <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border ${
                                order.status === 'pending_verification' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                order.status === 'placed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] font-black text-primary/20 italic">#{order._id.slice(-8)}</span>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 italic">Client</p>
                              <p className="text-sm font-black text-primary italic truncate">{order.shippingAddress.name}</p>
                           </div>
                           <Price amount={order.totals.grandTotal} className="text-2xl font-black text-primary italic tracking-tighter" />
                        </div>

                        {/* Payment Evidence */}
                        <div className="lg:col-span-6 bg-primary/5 rounded-3xl p-6 border border-border/20">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary italic">
                                    <Banknote size={12} /> <span>Method</span>
                                 </div>
                                 <p className="text-sm font-black text-primary uppercase italic">{order.paymentMethod}</p>
                              </div>
                              {order.paymentDetails && (
                                <>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary italic">
                                       <Hash size={12} /> <span>TrxID</span>
                                    </div>
                                    <code className="text-xs font-black text-primary bg-background px-2 py-1 rounded-lg block">{order.paymentDetails.trxId}</code>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary italic">
                                       <Phone size={12} /> <span>Sender</span>
                                    </div>
                                    <p className="text-sm font-black text-primary italic">{order.paymentDetails.senderNumber}</p>
                                  </div>
                                </>
                              )}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3">
                           {order.status === 'pending_verification' ? (
                             <div className="flex flex-col gap-3">
                               <Button 
                                  onClick={() => verifyOrder(order._id, "verify")}
                                  className="w-full h-14 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest italic hover:scale-[1.02] transition-transform"
                               >
                                  <CheckCircle2 size={16} className="mr-2" /> Verify Payment
                               </Button>
                               <Button 
                                  variant="ghost"
                                  onClick={() => verifyOrder(order._id, "reject")}
                                  className="w-full h-14 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-widest italic hover:bg-red-500/5 transition-all"
                               >
                                  <XCircle size={16} className="mr-2" /> Reject
                               </Button>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center gap-1 text-primary/30 uppercase font-black text-[9px] italic">
                                <ShieldCheck size={20} className="mb-2" />
                                <span>Finalized by {order.verifiedBy?.split('@')[0]}</span>
                                <span>{new Date(order.verifiedAt).toLocaleDateString()}</span>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </StaggerContainer>
          )}
        </div>
      </Container>
    </div>
  );
}
