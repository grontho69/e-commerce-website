import Image from "next/image";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import Container from "@/components/Container";
import Price from "@/components/Price";
import ProductForm from "./ProductForm";
import { FadeIn } from "@/components/Motion";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    const db = await getDb();
    const rawProduct = await db.collection("products").findOne({ slug });
    if (rawProduct) {
      product = JSON.parse(JSON.stringify(rawProduct));
    }
  } catch (error) {
    console.error("Product details build-time DB fetch failed:", error.message);
  }

  if (!product) {
    // During build time, if we can't find the product, we might want to return notFound
    // but we check if we are in production build to be safe
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
       return <div className="pt-32 pb-40 text-center">Protocol Offline: Database connection required.</div>;
    }
    notFound();
  }

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Visual Presentation */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-neutral-100 group cursor-zoom-in bg-white">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                priority
              />
            </div>
          </FadeIn>

          {/* Narrative & Acquisition */}
          <div className="flex flex-col justify-center">
            <FadeIn direction="left" delay={0.3}>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-primary font-bold uppercase tracking-widest text-[10px]">{product.category}</p>
                <div className="h-px w-8 bg-neutral-200" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{product.tier || 'Premium'} Collection</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-black mb-6 uppercase">
                {product.title}
              </h1>

              <div className="flex items-center space-x-8 mb-10 py-6 border-y border-neutral-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Price</span>
                  <Price amount={product.price} className="text-3xl font-bold text-black tracking-tight" />
                </div>
                <div className="h-10 w-px bg-neutral-100" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Availability</span>
                   <span className="text-xs font-bold text-primary uppercase tracking-widest">In Stock</span>
                </div>
              </div>
              
              <div className="prose prose-neutral mb-12">
                <p className="text-neutral-500 text-base md:text-lg font-medium leading-relaxed">{product.description}</p>
              </div>

              {/* Add to Cart Client Component */}
              <ProductForm product={product} />

              {/* Security & Logistics Protocols */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-10 border-t border-neutral-100">
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all">
                    <Truck size={16} />
                  </div>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Nationwide Shipping</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all">
                    <RotateCcw size={16} />
                  </div>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">7-Day Returns</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>

  );
}
