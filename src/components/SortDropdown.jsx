"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const sortOptions = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "A-Z (Name)", value: "name-asc" },
    { label: "Z-A (Name)", value: "name-desc" },
    { label: "Trending", value: "trending" },
  ];

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
  };

  const activeLabel = sortOptions.find(opt => opt.value === currentSort)?.label || "Sort By";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-16 px-8 bg-muted/20 rounded-[1.5rem] flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest italic hover:bg-card transition-all border border-border/10 outline-none active:scale-95 text-primary">
          <ArrowUpDown size={18} className="text-secondary" />
          <span>{activeLabel}</span>
          <ChevronDown size={14} className="text-secondary opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-[2rem] p-3 border-border/20 shadow-3xl shadow-primary/20 bg-card italic">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSort(option.value)}
            className={`rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest italic cursor-pointer mb-2 transition-all ${
              currentSort === option.value 
                ? "bg-secondary text-primary shadow-lg shadow-secondary/10" 
                : "text-muted-foreground hover:bg-muted/10 hover:text-primary"
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

  );
}
