import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import Container from "@/components/Container";
import { FadeIn, StaggerContainer } from "@/components/Motion";
import Price from "@/components/Price";
import { Package, User, MapPin, Calendar, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const db = await getDb();
  const rawOrders = await db.collection("orders")
    .find({ userEmail: session.user.email })
    .sort({ createdAt: -1 })
    .toArray();
    
  const orders = JSON.parse(JSON.stringify(rawOrders));

  return (
    <div className="pt-24 pb-32 min-h-screen bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn direction="right">
              <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm sticky top-28">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-24 h-24 bg-neutral-50 rounded-2xl flex items-center justify-center mb-5 border border-neutral-100 shadow-inner overflow-hidden group">
                    {session.user.image ? (
                       <img src={session.user.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                       <User size={40} className="text-neutral-300" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-black uppercase tracking-tight">{session.user.name || "Customer"}</h2>
                  <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest mt-2">{session.user.email}</p>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-neutral-100">
                  <div className="flex items-center space-x-3 text-neutral-400 group">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Joined March 2026</span>
                  </div>
                  <div className="inline-flex px-4 py-2 bg-black text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    {session.user.role?.toUpperCase() || "MEMBER"}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Orders Main */}
          <div className="lg:col-span-3">
            <FadeIn direction="down" delay={0.2}>
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-10">
                <div>
                  <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-2 uppercase text-black">Order <span className="text-primary">History</span></h1>
                  <p className="text-neutral-500 font-medium text-base md:text-lg">Track and manage your past purchases.</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-end">
                  <span className="text-[10px] font-bold text-neutral-400 mb-1 uppercase tracking-widest">Total Orders</span>
                  <span className="text-3xl font-bold text-black tracking-tight">{orders.length}</span>
                </div>
              </div>
            </FadeIn>

            {orders.length === 0 ? (
              <FadeIn direction="up" delay={0.4}>
                <div className="bg-white rounded-3xl p-24 text-center border border-neutral-100 shadow-sm group">
                  <Package size={64} className="text-neutral-100 mx-auto mb-8 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-black">No Orders Found</h3>
                  <p className="text-neutral-500 font-medium max-w-sm mx-auto">You haven't placed any orders yet. Start your journey with our latest collection.</p>
                </div>
              </FadeIn>
            ) : (
              <StaggerContainer>
                <div className="space-y-10">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden transition-all hover:shadow-lg group">
                      <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-neutral-50">
                          <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Order Details</p>
                            <h3 className="font-bold text-2xl text-black mb-4 tracking-tight leading-none">#{order._id.toString().slice(-8).toUpperCase()}</h3>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-none">
                                <Calendar size={14} className="mr-2" /> {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                                order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-neutral-900 text-white'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 md:mt-0 md:text-right flex flex-col justify-end">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Total Amount</p>
                            <Price amount={order.totals.grandTotal} className="text-4xl font-bold text-black tracking-tight leading-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl border border-neutral-100 group/item transition-colors hover:bg-white">
                                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center">
                                     <span className="text-black inline-block w-6">{item.qty}x</span> <span>{item.title}</span>
                                  </span>
                                  <div className="flex items-center gap-3">
                                     {item.selectedSize && <span className="text-[9px] font-bold text-neutral-400 px-2 py-0.5 border border-neutral-200 rounded">SIZE: {item.selectedSize}</span>}
                                     <Price amount={item.price * item.qty} className="text-black font-bold text-[10px]" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">Shipping Address</h4>
                            <div className="flex items-start space-x-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                              <MapPin size={20} className="text-neutral-400 mt-0.5" />
                              <div className="flex flex-col space-y-1">
                                <p className="font-bold text-black text-sm uppercase tracking-tight">{order.shippingAddress.name}</p>
                                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest leading-relaxed">{order.shippingAddress.address}</p>
                                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{order.shippingAddress.area}, {order.shippingAddress.city}</p>
                                <div className="mt-3 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                   <p className="text-xs font-bold text-black">{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 px-8 py-4 flex justify-between items-center border-t border-neutral-100">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Payment Method: {order.paymentMethod.toUpperCase()}</span>
                        </div>
                        <div className="flex space-x-2">
                           <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Secure Bank Authorization</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </div>
        </div>
      </Container>
    </div>

  );
}
