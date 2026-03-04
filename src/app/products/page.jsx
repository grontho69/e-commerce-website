import { getDb } from "@/lib/mongodb";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { StaggerContainer, FadeIn } from "@/components/Motion";
import { Filter, SlidersHorizontal, ChevronDown, SearchX } from "lucide-react";
import SortDropdown from "@/components/SortDropdown";

export default async function ProductsPage({ searchParams }) {
  const db = await getDb();
  const search = await searchParams;
  const category = search.category;
  const filter = search.filter;
  const searchQ = search.search;
  const sortParam = search.sort || "newest";
  
  let query = {};
  if (category) query.category = category;
  
  // Refined AAZBD inspired filtering
  if (filter === "exclusive") query.tier = "Gold";
  if (filter === "budget") query.price = { $lt: 1500 };
  if (filter === "new") {
    // Show items from last 30 days or just stay with sort order
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query.createdAt = { $gte: thirtyDaysAgo };
  }

  if (searchQ) {
    query.$or = [
      { title: { $regex: searchQ, $options: "i" } },
      { description: { $regex: searchQ, $options: "i" } },
      { category: { $regex: searchQ, $options: "i" } }
    ];
  }
  
  let sort = { createdAt: -1 };
  if (sortParam === "price-asc") sort = { price: 1 };
  if (sortParam === "price-desc") sort = { price: -1 };
  if (sortParam === "name-asc") sort = { title: 1 };
  if (sortParam === "name-desc") sort = { title: -1 };
  if (sortParam === "trending") sort = { tier: 1 }; 

  const rawProducts = await db.collection("products")
    .find(query)
    .sort(sort)
    .toArray();
    
  const products = JSON.parse(JSON.stringify(rawProducts));

  const pageTitle = searchQ
    ? `Results for "${searchQ}"`
    : category 
      ? `${category.toUpperCase()} Collection` 
      : filter === "trending" 
        ? "Trending Now" 
        : filter === "exclusive" 
          ? "Signature Series" 
          : filter === "budget"
            ? "Budget Picks"
            : filter === "new"
              ? "Newly Published"
              : "Global Collection";

  return (
    <div className="pt-24 pb-32 bg-neutral-50 min-h-screen">
      <Container>
        {/* Banner/Header */}
        <FadeIn direction="down">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-10">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-0.5 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Our Collection</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight uppercase text-black leading-tight">
                {pageTitle.split(' ')[0]} <span className="text-primary italic">{pageTitle.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-neutral-500 font-medium mt-6 text-base md:text-lg max-w-xl leading-relaxed">
                Discover our curated archive of {products.length} unique pieces, blending modern silhouettes with exceptional Bangladeshi craftsmanship.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
               <SortDropdown />
               {/* Filters button placeholder */}
               <button className="h-12 md:h-14 px-6 md:px-8 bg-white rounded-xl flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-neutral-100 shadow-sm active:scale-95 text-black">
                 <SlidersHorizontal size={16} />
                 <span>Filter</span>
               </button>
            </div>
          </header>
        </FadeIn>

        {products.length === 0 ? (
          <FadeIn direction="up">
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-8 text-neutral-300 border border-neutral-100">
                 <SearchX size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 text-black">No items found</h3>
              <p className="text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed text-sm">We couldn't find any products matching your current criteria. Try adjusting your filters or search terms.</p>
              <a href="/products" className="mt-8 inline-flex items-center justify-center h-12 px-8 rounded-xl bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">
                 View All Products
              </a>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </StaggerContainer>
        )}
      </Container>
    </div>

  );
}
