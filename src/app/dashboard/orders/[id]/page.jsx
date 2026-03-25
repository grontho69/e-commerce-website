"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import gsap from "gsap";
import { useSession } from "next-auth/react";
import { CheckCircle2, Package, Truck, MapPin, Archive, Clock } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", percentage: 0, color: "bg-neutral-500", text: "text-neutral-500", border: "border-neutral-500/20", icon: Clock },
  confirmed: { label: "Confirmed", percentage: 20, color: "bg-blue-500", text: "text-blue-500", border: "border-blue-500/20", icon: CheckCircle2 },
  processing: { label: "Processing", percentage: 40, color: "bg-purple-500", text: "text-purple-500", border: "border-purple-500/20", icon: Package },
  shipped: { label: "Shipped", percentage: 60, color: "bg-orange-500", text: "text-orange-500", border: "border-orange-500/20", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", percentage: 80, color: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500/20", icon: MapPin },
  delivered: { label: "Delivered", percentage: 100, color: "bg-green-500", text: "text-green-500", border: "border-green-500/20", icon: Archive },
};

function ProgressBar({ percentage, colorClass }) {
  const barRef = useRef(null);

  useEffect(() => {
    gsap.to(barRef.current, {
      width: `${percentage}%`,
      duration: 1.5,
      ease: "power3.inOut",
    });
  }, [percentage]);

  return (
    <div className="relative w-full h-[2px] bg-neutral-100 my-16 rounded-full overflow-hidden">
      <div 
        ref={barRef}
        className={`absolute top-0 left-0 h-full ${colorClass}`}
        style={{ width: "0%" }}
      />
    </div>
  );
}

function TimelineItem({ entry, index, isFirst, isActive }) {
  const itemRef = useRef(null);
  const statusDetails = STATUS_MAP[entry.status] || STATUS_MAP.pending;
  const Icon = statusDetails.icon;

  useEffect(() => {
    gsap.fromTo(itemRef.current, 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, delay: index * 0.15, ease: "power2.out" }
    );
  }, [index, entry.status]);

  return (
    <div ref={itemRef} className={`relative flex gap-8 pb-12 last:pb-0 transition-opacity duration-300 ${!isFirst ? "opacity-50 hover:opacity-100" : ""}`}>
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-500 ${isFirst || isActive ? `${statusDetails.color} text-white shadow-lg ${statusDetails.color}/30 shadow-[0_0_15px_currentColor]` : "bg-neutral-50 text-neutral-400 border-neutral-200"}`}>
           <Icon size={16} />
        </div>
        {!isFirst && <div className="w-[2px] h-full bg-neutral-100 mt-2 rounded-full" />}
      </div>
      <div className="flex-1 pt-1.5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
          <h4 className={`text-sm md:text-base font-black tracking-widest uppercase ${isFirst ? statusDetails.text : "text-neutral-700"}`}>
             {statusDetails.label}
          </h4>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mt-1 sm:mt-0">
             {new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(entry.timestamp))}
          </span>
        </div>
        <p className={`text-sm font-medium leading-relaxed tracking-wide ${isFirst ? "text-neutral-800" : "text-neutral-500"}`}>
          {entry.message}
        </p>
      </div>
    </div>
  );
}

export default function OrderTrackingPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.status === 401 || res.status === 403) return router.push("/login");
      if (res.ok) setOrder(await res.json());
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") return router.push("/login");
    if (status === "loading") return;

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
       <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-black uppercase tracking-widest text-neutral-400">Order Not Found</div>
    );
  }

  if (order.status === "pending" || !order.timeline?.length) {
    return (
      <div className="min-h-screen pt-40 pb-32 bg-neutral-50 flex flex-col items-center text-center px-6">
         <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mb-8 animate-pulse text-neutral-500">
            <Clock size={24} />
         </div>
         <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 opacity-70">Logistics Node #{order._id.slice(-8)}</p>
         <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase mb-6">Awaiting Approval</h1>
         <p className="text-sm md:text-base text-neutral-500 tracking-wide font-medium max-w-md leading-relaxed selection:bg-neutral-200">
           Your purchase is currently being verified. Secure tracking architecture will mathematically activate upon confirmation.
         </p>
      </div>
    );
  }

  const currentStatusObj = STATUS_MAP[order.status] || STATUS_MAP.confirmed;
  const reversedTimeline = [...order.timeline].reverse();

  return (
    <div className="min-h-screen pt-32 pb-40 bg-white selection:bg-neutral-100">
      <Container>
        <div className="max-w-3xl mx-auto">
          
          <header className="mb-20 text-center sm:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-50 border border-neutral-100 mb-8 sm:mb-12">
               <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Live Architecture Node #{order._id.slice(-8)}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[0.9]">
              {currentStatusObj.label}
            </h1>
            
            <ProgressBar percentage={currentStatusObj.percentage} colorClass={currentStatusObj.color} />
            
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8 bg-neutral-50 rounded-[2rem] p-8 md:p-10 border border-neutral-100">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-2 justify-center sm:justify-start">
                   <Clock size={12} /> Projected Arrival
                </p>
                <p className="text-lg md:text-xl font-black text-black uppercase tracking-tight">
                   {order.estimatedDelivery ? new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(order.estimatedDelivery)) : "Pending"}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-2 justify-center sm:justify-end">
                   <Truck size={12} /> Protocol
                </p>
                <p className="text-lg md:text-xl font-black text-black uppercase tracking-tight">Standard Priority</p>
              </div>
            </div>
          </header>

          <main className="pt-16 sm:pt-20 border-t border-neutral-100 relative">
             <div className="absolute top-0 left-1/2 sm:left-12 -translate-y-1/2 bg-white px-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Activity Ledger</h3>
             </div>
             <div className="px-4 sm:px-8">
               {reversedTimeline.map((entry, idx) => (
                 <TimelineItem 
                   key={idx} 
                   entry={entry} 
                   index={idx} 
                   isFirst={idx === 0}
                   isActive={entry.status === order.status}
                 />
               ))}
             </div>
          </main>

        </div>
      </Container>
    </div>
  );
}
