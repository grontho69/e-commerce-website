import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/Container";
import { FadeIn } from "@/components/Motion";

export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-40 bg-neutral-50 flex flex-col">
      <Container>
        {/* Placeholder for the Header / Page Title area */}
        <FadeIn>
          <div className="flex flex-col mb-16 space-y-4 max-w-lg mx-auto md:mx-0">
             <Skeleton className="h-4 w-32 rounded-full" />
             <Skeleton className="h-12 w-64 md:w-96 rounded-lg" />
             <Skeleton className="h-4 w-48 rounded-full" />
          </div>
        </FadeIn>

        {/* Content Skeletons layout mimicking generic cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
