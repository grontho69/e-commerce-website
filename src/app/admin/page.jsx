import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import Container from "@/components/Container";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import Price from "@/components/Price";
import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Calendar,
  Plus,
  ChevronRight,
  ShieldCheck,
  Activity,
  Globe,
  Database,
  Lock
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const db = await getDb();
  
  // Fetch stats concurrently
  const [orders, products, users] = await Promise.all([
    db.collection("orders").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("products").countDocuments(),
    db.collection("users").countDocuments(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totals?.grandTotal || 0), 0);
  const recentOrders = JSON.parse(JSON.stringify(orders.slice(0, 5)));

  const stats = [
    { label: "Global Revenue", value: totalRevenue, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", isPrice: true },
    { label: "Order Volume", value: orders.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Asset Count", value: products, icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Members", value: users, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background">
      <Container>
        <FadeIn direction="down">
          <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-border/10 pb-16">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-primary text-secondary rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-secondary/20">
                  <ShieldCheck size={32} />
                </div>
                <div>
                   <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-primary">Command <span className="text-secondary italic">Center</span></h1>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-2 italic">Admin Authorization Level 04 • Secure Node</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link href="/admin/products/new">
                <button className="h-16 px-8 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95 italic group border border-secondary/10">
                  <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform" /> Add New Asset
                </button>
              </Link>
            </div>
          </header>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-card rounded-[3rem] p-10 border border-border/50 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12" />
                <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-lg`}>
                  <stat.icon size={32} />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-3 italic leading-none">{stat.label}</p>
                {stat.isPrice ? (
                  <Price amount={stat.value} className="text-4xl font-black text-primary italic tracking-tighter" />
                ) : (
                   <h3 className="text-4xl font-black text-primary italic tracking-tighter">{stat.value}</h3>
                )}
              </div>
            ))}
          </div>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Recent Orders Table */}
          <div className="lg:col-span-8">
            <FadeIn direction="right">
              <div className="bg-card rounded-[4rem] border border-border/50 shadow-sm overflow-hidden">
                <div className="p-12 border-b border-border/20 flex justify-between items-center bg-primary/5">
                   <div>
                      <h3 className="font-black text-xl uppercase tracking-widest italic flex items-center leading-none text-primary">
                        <Activity size={24} className="mr-4 text-secondary" /> Active Feed
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 italic opacity-60">Real-time Transaction Protocol</p>
                   </div>
                  <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-secondary italic border-b-2 border-secondary/20 hover:border-secondary transition-all">Audit Logs</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/10 text-muted-foreground text-[9px] font-black uppercase tracking-widest italic border-b border-border/10">
                        <th className="px-12 py-6">Identity</th>
                        <th className="px-12 py-6">Customer</th>
                        <th className="px-12 py-6">Settlement</th>
                        <th className="px-12 py-6">Status</th>
                        <th className="px-12 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 italic">
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-primary/5 transition-colors group">
                          <td className="px-12 py-8 font-black text-primary text-xs tracking-tighter">#{order._id.toString().slice(-8).toUpperCase()}</td>
                          <td className="px-12 py-8">
                            <div className="flex flex-col">
                              <span className="font-black text-primary text-sm uppercase">{order.shippingAddress.name}</span>
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1 opacity-50">{order.userEmail}</span>
                            </div>
                          </td>
                          <td className="px-12 py-8 font-black text-primary">
                             <Price amount={order.totals?.grandTotal || 0} />
                          </td>
                          <td className="px-12 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                               order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/10' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-12 py-8 text-right">
                             <Link href="/admin/orders">
                               <div className="w-10 h-10 rounded-xl bg-muted/20 text-primary flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                                  <ChevronRight size={18} />
                               </div>
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {recentOrders.length === 0 && (
                     <div className="py-20 text-center text-muted-foreground font-black uppercase tracking-widest italic text-xs">No Recent Traffic Detected.</div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Quick Actions / Activity */}
          <div className="lg:col-span-4 space-y-8">
             <FadeIn direction="left">
                <div className="bg-primary rounded-[4rem] p-12 text-secondary relative overflow-hidden shadow-2xl shadow-primary/40 border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-bl-full -z-0 blur-3xl opacity-50" />
                    <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-10 italic relative z-10 border-b border-white/5 pb-6 text-secondary">System Nodes</h3>
                    <div className="grid grid-cols-1 gap-6 relative z-10">
                      <Link href="/admin/products">
                        <button className="w-full h-20 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] flex items-center justify-between px-8 transition-all group/btn italic text-secondary">
                          <div className="flex items-center gap-4">
                             <Database size={20} className="text-secondary" />
                             <span className="font-black text-xs uppercase tracking-widest">Vault Management</span>
                          </div>
                          <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform opacity-50" />
                        </button>
                      </Link>
                      <Link href="/admin/orders">
                        <button className="w-full h-20 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] flex items-center justify-between px-8 transition-all group/btn italic text-secondary">
                          <div className="flex items-center gap-4">
                             <TrendingUp size={20} className="text-secondary" />
                             <span className="font-black text-xs uppercase tracking-widest">Order Ledger</span>
                          </div>
                           <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform opacity-50" />
                        </button>
                      </Link>
                    </div>
                </div>
             </FadeIn>
             
             <FadeIn direction="left" delay={0.2}>
                <div className="bg-card rounded-[3rem] p-10 border border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 text-primary pointer-events-none group-hover:scale-110 transition-transform">
                       <Lock size={120} />
                    </div>
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-10 italic text-muted-foreground">Node Status</h3>
                    <div className="space-y-8 italic">
                      {[
                        { label: "Database Sync", status: "Nominal", color: "text-emerald-500" },
                        { label: "Identity Vault", status: "Secure", color: "text-secondary" },
                        { label: "Payment Gateway", status: "Operational", color: "text-secondary" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-4 border-b border-border/10 last:border-none">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
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
