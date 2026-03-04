"use client";
import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { FadeIn } from "@/components/Motion";
import Price from "@/components/Price";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, Edit, Trash2, ExternalLink, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this item from catalog?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product Purged");
        fetchProducts();
      } else {
        toast.error("Operation Failed");
      }
    } catch (err) {
      toast.error("Network Error");
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="pt-32 pb-40 min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <Container>
        <FadeIn direction="down">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-2 text-primary">Manage <span className="text-secondary italic">Catalog</span></h1>
              <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] italic">Database Archive • {products.length} Assets Registered</p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/admin/products/new">
                <button className="h-14 px-8 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95 italic border border-secondary/10">
                  <Plus size={18} className="mr-2" /> Add New Asset
                </button>
              </Link>
            </div>
          </header>
        </FadeIn>

        <FadeIn direction="up">
          <div className="bg-card rounded-[2.5rem] p-6 mb-8 border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
              <input 
                type="text" 
                placeholder="Search catalog by title or node..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-muted/20 rounded-2xl border border-border/10 focus:bg-background focus:ring-4 focus:ring-secondary/10 transition-all text-[10px] font-black uppercase tracking-widest italic placeholder:text-muted-foreground/30 text-primary"
              />
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-muted/10 rounded-2xl border border-border/10">
               <Filter size={14} className="text-secondary" />
               <span className="text-[10px] font-black uppercase tracking-widest italic text-muted-foreground">Protocols Active</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="bg-card rounded-[3rem] border border-border/50 shadow-sm overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] italic border-b border-border/10">
                    <th className="px-10 py-6">Product Matrix</th>
                    <th className="px-10 py-6">Node</th>
                    <th className="px-10 py-6">Settlement</th>
                    <th className="px-10 py-6 text-right">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 italic">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                          <div className="relative w-20 h-24 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-border/10 group-hover:scale-105 transition-transform duration-500">
                            <Image 
                              src={product.imageUrl} 
                              alt={product.title} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-black text-primary leading-tight mb-1 uppercase italic tracking-tighter text-lg">{product.title}</h4>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic opacity-50">SKU: {product._id.toString().slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-black text-primary italic tracking-tighter text-xl scale-y-110">
                        <Price amount={product.price} />
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Link href={`/products/${product.slug}`} target="_blank">
                             <button className="w-12 h-12 bg-muted/20 hover:bg-primary hover:text-secondary rounded-xl transition-all flex items-center justify-center border border-border/10 group-hover:border-primary/20">
                               <ExternalLink size={16} />
                             </button>
                          </Link>
                          <Link href={`/admin/products/${product._id}`}>
                            <button className="w-12 h-12 bg-muted/20 hover:bg-secondary hover:text-primary rounded-xl transition-all flex items-center justify-center border border-border/10 group-hover:border-secondary/20">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="w-12 h-12 bg-muted/20 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-border/10 group-hover:border-red-500/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center bg-primary/5">
                 <Package size={60} className="mx-auto text-primary/10 mb-6" />
                 <p className="text-primary/30 font-black uppercase tracking-[0.4em] italic text-[10px]">No assets matching selection parameters.</p>
              </div>
            )}
          </div>
        </FadeIn>
      </Container>
    </div>

  );
}
