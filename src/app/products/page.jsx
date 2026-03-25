import { getDb } from "@/lib/mongodb";
import ClientCatalog from "@/components/ClientCatalog";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/Skeletons";

export const dynamic = 'force-dynamic';

export default async function ProductsRoute() {
  let products = [];
  try {
    const db = await getDb();
    const rawProducts = await db.collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
      
    products = JSON.parse(JSON.stringify(rawProducts));
  } catch (error) {
    console.error("Products catalog fetch error:", error.message);
  }

  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
       <ClientCatalog initialProducts={products} />
    </Suspense>
  );
}
