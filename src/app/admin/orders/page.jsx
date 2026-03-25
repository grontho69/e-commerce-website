"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import { 
  CheckCircle2, XCircle, Search, Clock, 
  CreditCard, Phone, Hash, Banknote,
  ArrowRight, ShieldCheck, Filter, Truck, Archive, MapPin, Package
} from "lucide-react";
import Price from "@/components/Price";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const STATUS_MAP = {
  pending: { label: "Pending", color: "bg-neutral-500", text: "text-neutral-500", border: "border-neutral-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500", text: "text-blue-500", border: "border-blue-500/20", icon: CheckCircle2 },
  processing: { label: "Processing", color: "bg-purple-500", text: "text-purple-500", border: "border-purple-500/20", icon: Package },
  shipped: { label: "Shipped", color: "bg-orange-500", text: "text-orange-500", border: "border-orange-500/20", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-yellow-500", text: "text-yellow-600", border: "border-yellow-500/20", icon: MapPin },
  delivered: { label: "Delivered", color: "bg-green-500", text: "text-green-500", border: "border-green-500/20", icon: Archive },
};

export default function AdminOrders() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

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
          status: action === "verify" ? "confirmed" : "payment_failed",
          paymentStatus: action === "verify" ? "paid" : "rejected" 
        } : o));
      } else {
        const data = await res.json();
        const errorMessage = data.debug ? `Error: ${data.message} (${data.debug})` : data.message || "Process failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("System error");
    }
  };

  if (loading) return (
    <div className="pt-32 pb-40 min-h-screen bg-neutral-50 flex items-center justify-center">
       <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black animate-spin" />
    </div>
  );

  const filteredOrders = orders.filter(o => filter === "all" ? true : filter === "pending" ? o.status === "pending" : o.status !== "pending");

  return (
    <div className="pt-24 pb-32 bg-white min-h-screen selection:bg-neutral-100">
      <Container>
        <FadeIn direction="down">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 px-4 md:px-0">
             <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-100 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  <span>Administrative Authority Node</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-[0.9]">Order <br /><span className="text-neutral-400">Ledger</span></h1>
             </div>
             
             <div className="flex flex-wrap items-center gap-2 bg-neutral-50 p-2 rounded-2xl border border-neutral-100">
                {[
                  { id: "pending", label: "Awaiting Approval" },
                  { id: "active", label: "Active Nodes" },
                  { id: "all", label: "Global Archive" }
                ].map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all flex-1 md:flex-none ${
                      filter === f.id ? "bg-black text-white shadow-md" : "text-neutral-400 hover:text-black hover:bg-neutral-200/50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
             </div>
          </div>
        </FadeIn>

        <div className="space-y-6 px-4 md:px-0">
          {filteredOrders.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center bg-neutral-50 rounded-[2.5rem] border border-neutral-100">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-neutral-300">
                  <Archive size={24} />
               </div>
               <p className="text-sm font-black uppercase tracking-widest text-neutral-400">No telemetry matching protocol</p>
            </div>
          ) : (
            <StaggerContainer>
              <div className="grid grid-cols-1 gap-8">
                {filteredOrders.map((order) => {
                  const statusObj = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  const StatusIcon = statusObj.icon;
                  
                  return (
                  <div key={order._id} className="bg-white rounded-[2rem] border border-neutral-200 p-6 md:p-10 transition-shadow duration-300 hover:shadow-xl hover:border-black/10 overflow-hidden group">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                        
                        {/* Summary Node */}
                        <div className="lg:col-span-3 space-y-6">
                           <div className="flex flex-wrap items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${statusObj.color}/10 ${statusObj.text} bg-${statusObj.color}/5`}>
                                <StatusIcon size={10} /> {statusObj.label}
                              </span>
                              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-300 uppercase">#{order._id.slice(-6)}</span>
                           </div>
                           <div className="pt-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Subject</p>
                              <p className="text-base font-black text-black tracking-tight">{order.shippingAddress.name}</p>
                           </div>
                           <Price amount={order.totals.grandTotal} className="text-2xl font-black text-black tracking-tighter pt-2 border-t border-neutral-100" />
                        </div>

                        {/* Payment Evidence Node */}
                        <div className="lg:col-span-4 bg-neutral-50 rounded-2xl p-6 border border-neutral-100 self-stretch">
                           <div className="flex flex-col gap-6 h-full justify-center">
                              <div>
                                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                                    <Banknote size={12} /> <span>Method</span>
                                 </div>
                                 <p className="text-sm font-black text-black uppercase tracking-tight">{order.paymentMethod}</p>
                              </div>
                              {order.paymentDetails && (
                                <div className="grid grid-cols-2 gap-4 mt-2 pt-6 border-t border-neutral-200/50">
                                  <div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                                       <Hash size={12} /> <span>TrxID</span>
                                    </div>
                                    <code className="text-[11px] font-bold text-black bg-white px-2 py-1 rounded border border-neutral-100 block">{order.paymentDetails.trxId}</code>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                                       <Phone size={12} /> <span>Sender</span>
                                    </div>
                                    <p className="text-xs font-bold tracking-widest text-black">{order.paymentDetails.senderNumber}</p>
                                  </div>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* Actions & Lifecycle Node */}
                        <div className="lg:col-span-5 h-full flex flex-col">
                           {order.status === 'pending' ? (
                             <div className="flex flex-col gap-3 justify-center h-full">
                               <Button 
                                  onClick={async () => {
                                      const res = await fetch(`/api/admin/orders/${order._id}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ status: "confirmed", message: "Your order has been approved and confirmed." })
                                      });
                                      if (res.ok) fetchOrders(); else toast.error("Approval failed");
                                  }}
                                  className="w-full h-[3.5rem] bg-black text-white hover:bg-neutral-800 rounded-xl font-black uppercase tracking-widest text-xs transition-colors"
                               >
                                  <CheckCircle2 size={16} className="mr-2" /> Approve & Confirm
                               </Button>
                               <Button 
                                  variant="ghost"
                                  onClick={() => verifyOrder(order._id, "reject")}
                                  className="w-full h-[3.5rem] border border-red-500/20 text-red-500 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-50 hover:border-red-500/30 transition-colors"
                               >
                                  <XCircle size={16} className="mr-2" /> Reject Order
                               </Button>
                             </div>
                           ) : (
                             <div className="flex flex-col gap-4 w-full h-full">
                                <div className="text-emerald-600 uppercase font-black text-[9px] tracking-widest flex items-center justify-center gap-2 w-full bg-emerald-50 py-3 rounded-lg border border-emerald-100">
                                   <ShieldCheck size={14} /> Approved System Node
                                </div>
                                
                                <div className="w-full flex flex-col gap-3 flex-1 justify-end">
                                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Update Tracking Topology</p>
                                  <div className="grid grid-cols-2 gap-2">
                                     {['processing', 'shipped', 'out_for_delivery', 'delivered'].map((s) => {
                                        const cMap = STATUS_MAP[s];
                                        return (
                                        <button 
                                          key={s}
                                          disabled={order.status === s}
                                          onClick={async () => {
                                            const res = await fetch(`/api/admin/orders/${order._id}`, {
                                              method: "PATCH",
                                              headers: { "Content-Type": "application/json" },
                                              body: JSON.stringify({ status: s })
                                            });
                                            if (res.ok) {
                                              toast.success(`Tracking updated to ${s.replace('_', ' ')}`);
                                              fetchOrders();
                                            } else {
                                              toast.error("Status update failed");
                                            }
                                          }}
                                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-between ${
                                            order.status === s 
                                              ? `${cMap.color} text-white shadow-md border-transparent` 
                                              : `bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50`
                                          }`}
                                        >
                                          <span className="truncate">{s.replace(/_/g, ' ')}</span>
                                          {order.status === s && <CheckCircle2 size={12} />}
                                        </button>
                                     )})}
                                  </div>
                                </div>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                )})}
              </div>
            </StaggerContainer>
          )}
        </div>
      </Container>
    </div>
  );
}
