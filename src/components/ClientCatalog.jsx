"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { StaggerContainer, FadeIn } from "@/components/Motion";
import { SlidersHorizontal, SearchX, X, Check, ChevronDown, CheckCircle2 } from "lucide-react";
import gsap from "gsap";

export default function ClientCatalog({ initialProducts }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Unique attribute aggregations for filters UX
  const availableCategories = useMemo(() => Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean))), [initialProducts]);
  const availableTiers = useMemo(() => Array.from(new Set(initialProducts.map(p => p.tier).filter(Boolean))), [initialProducts]);
  const maxPrice = useMemo(() => Math.max(...initialProducts.map(p => p.price || 0), 1000), [initialProducts]);

  // Initial State from URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategoryParam = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialFilterParam = searchParams.get("filter") || "";

  // Match URL category with exact case in DB if possible
  const initialCategory = initialCategoryParam ? availableCategories.find(c => c.toLowerCase() === initialCategoryParam.toLowerCase()) || initialCategoryParam : "";

  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState(initialSort);

  // Filters State
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, maxPrice],
    tiers: [],
    customFilter: initialFilterParam
  });

  const gridRef = useRef(null);

  useEffect(() => {
    setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
  }, [maxPrice]);

  // The Core Filtering Engine (Real-Time Client Side)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search Query String
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) || 
        p.category?.toLowerCase().includes(q)
      );
    }

    // 2. Categories Array
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.some(c => c.toLowerCase() === p.category?.toLowerCase()));
    }

    // 3. Tiers/Types Array
    if (filters.tiers.length > 0) {
      result = result.filter(p => filters.tiers.includes(p.tier));
    }

    // 4. Custom Collection Filters (new, exclusive, budget)
    if (filters.customFilter) {
      if (filters.customFilter === "exclusive") {
        result = result.filter(p => p.tier === "Gold" || p.tier === "Signature" || p.tier === "Elite");
      } else if (filters.customFilter === "budget") {
        result = result.filter(p => p.price < 1500);
      } else if (filters.customFilter === "new") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        result = result.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
      }
    }

    // 5. Price Range
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // 6. Sorting algorithms
    switch (sortOption) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "name-desc": result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "trending": result.sort((a, b) => (b.tier === "Gold" ? 1 : -1) - (a.tier === "Gold" ? 1 : -1)); break;
      case "newest":
      default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }

    return result;
  }, [initialProducts, filters, searchQuery, sortOption]);

  // Silent URL push when internal state changes (avoids firing useSearchParams listeners)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortOption !== "newest") params.set("sort", sortOption);
    if (filters.categories.length === 1) params.set("category", filters.categories[0]);
    if (filters.customFilter) params.set("filter", filters.customFilter);
    window.history.replaceState(null, '', `/products?${params.toString()}`);
  }, [searchQuery, sortOption, filters.categories, filters.customFilter]);

  // Sync state when URL actually changes from an external Link click (e.g. Navbar)
  useEffect(() => {
    const urlCat = searchParams.get("category") || "";
    const urlFilter = searchParams.get("filter") || "";
    const urlSearch = searchParams.get("search") || "";
    const matchedCat = urlCat ? availableCategories.find(c => c.toLowerCase() === urlCat.toLowerCase()) || urlCat : "";
    
    setFilters(prev => ({
      ...prev,
      categories: matchedCat ? [matchedCat] : [],
      customFilter: urlFilter
    }));
    setSearchQuery(urlSearch);
  }, [searchParams, availableCategories]);
  // GSAP Animations
  useEffect(() => {
    if (filteredProducts.length > 0 && gridRef.current) {
      gsap.fromTo(gridRef.current.children, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      );
    }
  }, [filteredProducts]);

  // Filter Toggle Logic
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const removeFilterTag = (type, value) => {
    if (type === 'customFilter') {
      setFilters(prev => ({ ...prev, customFilter: "" }));
    } else {
      toggleFilter(type, value);
    }
  };

  const clearAllFilters = () => {
    setFilters({ categories: [], priceRange: [0, maxPrice], tiers: [], customFilter: "" });
    setSearchQuery("");
  };

  const activeTagCount = filters.categories.length + filters.tiers.length + (filters.customFilter ? 1 : 0) + (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <div className="pt-24 pb-32 bg-white min-h-screen selection:bg-neutral-100">
      <Container>
        
        {/* Banner Engine */}
        <FadeIn direction="down">
          <header className="mb-12 flex flex-col group border-b border-black pb-10">
            <div className="flex items-center space-x-3 mb-6">
               <div className="w-10 h-0.5 bg-black" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Global Archive</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
               <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-black leading-[0.85]">
                  The <br /><span className="text-neutral-300">Directory</span>
               </h1>
               
               <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="SEARCH ARCHIVE..." 
                   className="w-full md:w-64 h-14 px-6 bg-neutral-50 rounded-none border border-neutral-200 text-xs font-black uppercase tracking-[0.2em] focus:border-black focus:ring-0 outline-none transition-all placeholder:text-neutral-400"
                 />
                 
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Sort Dropdown (Native) */}
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="h-14 px-6 bg-white border border-neutral-200 text-xs font-black uppercase tracking-[0.2em] focus:border-black outline-none appearance-none cursor-pointer flex-1 md:flex-none min-w-[180px]"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">A-Z Directory</option>
                      <option value="trending">Trending Matrix</option>
                    </select>

                    <button 
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className={`h-14 px-6 md:px-8 border border-neutral-200 flex items-center justify-center space-x-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all ${isSidebarOpen ? 'bg-black text-white border-black' : 'bg-white text-black'}`}
                    >
                      <span>Filter</span>
                      {activeTagCount > 0 && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${isSidebarOpen ? 'bg-white text-black' : 'bg-black text-white'}`}>{activeTagCount}</span>
                      )}
                    </button>
                 </div>
               </div>
            </div>
          </header>
        </FadeIn>

        {/* Active Tags Ribbon */}
        {activeTagCount > 0 && (
          <FadeIn direction="up">
             <div className="flex flex-wrap items-center gap-2 mb-10 border border-neutral-100 p-4 bg-neutral-50 rounded-xl">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mr-2">Active Filters:</span>
                
                {filters.categories.map(c => (
                  <span key={`c-${c}`} onClick={() => removeFilterTag('categories', c)} className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors">
                     {c} <X size={10} className="group-hover:scale-125 transition-transform" />
                  </span>
                ))}
                
                {filters.tiers.map(t => (
                  <span key={`t-${t}`} onClick={() => removeFilterTag('tiers', t)} className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors">
                     Tier: {t} <X size={10} className="group-hover:scale-125 transition-transform" />
                  </span>
                ))}

                {filters.customFilter && (
                  <span onClick={() => removeFilterTag('customFilter')} className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors">
                     Collection: {filters.customFilter} <X size={10} className="group-hover:scale-125 transition-transform" />
                  </span>
                )}
                
                {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== maxPrice) && (
                  <span className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                     BDT {filters.priceRange[0]} - {filters.priceRange[1]}
                  </span>
                )}

                <button onClick={clearAllFilters} className="ml-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-red-500 transition-colors underline underline-offset-4 decoration-neutral-300">
                   Clear Engine
                </button>
             </div>
          </FadeIn>
        )}

        {/* The Grid Workspace */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
           
           {/* Filtering Desktop Sidebar / Extends fully to screen on mobile */}
           {isSidebarOpen && (
             <aside className="w-full lg:w-72 lg:sticky lg:top-32 shrink-0 animate-in slide-in-from-left-4 fade-in duration-300">
                <div className="space-y-10 border border-neutral-100 p-8">
                  
                  {/* Category Filter Node */}
                  {availableCategories.length > 0 && (
                    <div className="space-y-4">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black border-b border-black pb-3">Topology Sector</h3>
                       <div className="flex flex-col gap-3 pt-2">
                         {availableCategories.map(cat => {
                            const isChecked = filters.categories.includes(cat);
                            return (
                              <div key={cat} onClick={() => toggleFilter('categories', cat)} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border border-black flex items-center justify-center transition-colors ${isChecked ? 'bg-black text-white' : 'bg-transparent text-transparent group-hover:border-neutral-400'}`}>
                                   <Check size={10} strokeWidth={4} />
                                </div>
                                <span className={`text-[11px] font-bold tracking-[0.1em] uppercase transition-colors ${isChecked ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>{cat}</span>
                              </div>
                            )
                         })}
                       </div>
                    </div>
                  )}

                  {/* Tier Flag Node */}
                  {availableTiers.length > 0 && (
                     <div className="space-y-4">
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black border-b border-black pb-3">Class Level</h3>
                       <div className="flex flex-col gap-3 pt-2">
                         {availableTiers.map(tier => {
                            const isChecked = filters.tiers.includes(tier);
                            return (
                              <div key={tier} onClick={() => toggleFilter('tiers', tier)} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 border border-black flex items-center justify-center transition-colors ${isChecked ? 'bg-black text-white' : 'bg-transparent text-transparent group-hover:border-neutral-400'}`}>
                                   <Check size={10} strokeWidth={4} />
                                </div>
                                <span className={`text-[11px] font-bold tracking-[0.1em] uppercase transition-colors ${isChecked ? 'text-black' : 'text-neutral-500 group-hover:text-black'}`}>{tier}</span>
                              </div>
                            )
                         })}
                       </div>
                    </div>
                  )}

                  {/* Price Slider Node */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black border-b border-black pb-3">Value Range</h3>
                     <div className="pt-4 px-1">
                        <input 
                          type="range" 
                          min="0" 
                          max={maxPrice} 
                          step="100"
                          value={filters.priceRange[1]} 
                          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black outline-none" 
                        />
                        <div className="flex justify-between items-center mt-4">
                           <span className="text-[10px] font-black tracking-widest text-neutral-400">0</span>
                           <span className="text-xs font-black tracking-widest text-black bg-neutral-50 px-3 py-1 border border-neutral-100">BDT {filters.priceRange[1]}</span>
                        </div>
                     </div>
                  </div>

                </div>
             </aside>
           )}

           {/* Product Grid Render */}
           <div className="flex-1 w-full min-h-[500px]">
             <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                   Results Matrix / <span className="text-black">{filteredProducts.length} Objects</span>
                </p>
             </div>

             {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-neutral-50 border border-neutral-100">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mb-6 text-neutral-300">
                     <SearchX size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black">Null Returns</h3>
                  <p className="text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed text-xs">No garments match the current query parameters. Loosen the filter locks or reconstruct your search.</p>
                  <button onClick={clearAllFilters} className="mt-8 bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all">
                     Reset Matrix
                  </button>
                </div>
             ) : (
                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
             )}
           </div>

        </div>
      </Container>
    </div>
  );
}
