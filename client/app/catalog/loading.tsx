import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="w-full py-[60px] md:py-[90px] lg:py-[100px]">
			<section className="section-layout">
				<Skeleton variant="text" className="max-w-lg mb-5"/>
				<Skeleton variant="text" className="max-w-lg mb-5"/>
				<div className="grid grid-cols-4 gap-8">
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
					<Skeleton className="aspect-3/4"/>
				</div>
			</section>
    </main>
  );
}

