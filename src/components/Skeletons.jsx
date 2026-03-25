import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group relative rounded-3xl bg-white p-2 sm:p-3 overflow-hidden border border-neutral-100/60 shadow-xs flex flex-col space-y-4">
      <Skeleton className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100" />
      <div className="flex flex-col gap-2 px-1 pb-2">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/4 rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 border-b border-neutral-100 py-6 last:border-0 pl-4 w-full">
      <Skeleton className="w-20 h-24 rounded-lg flex-shrink-0 bg-neutral-100" />
      <div className="flex-grow space-y-3">
        <Skeleton className="h-4 w-3/4 sm:w-1/2 rounded-md" />
        <Skeleton className="h-4 w-1/4 rounded-md" />
        <Skeleton className="h-6 w-32 rounded-md mt-4" />
      </div>
      <Skeleton className="w-16 h-6 rounded-md ml-auto flex-shrink-0" />
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-6">
      <Skeleton className="w-20 h-20 rounded-full bg-neutral-100" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>
    </div>
  );
}
