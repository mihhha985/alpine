import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="w-full py-[60px] md:py-[90px] lg:py-[100px]">
			<section className="section-layout">
				<Skeleton variant="text" className="max-w-lg mb-5"/>
				<div className="flex gap-10">
					<Skeleton className=" aspect-530/508" />
					<section className="section-layout">
						<div className="w-full flex flex-col gap-6">
							<Skeleton variant="text" className="max-w-md" />
							<Skeleton variant="text" className="max-w-md" />
							<Skeleton variant="text" className="max-w-md" />
						</div>
					</section>
				</div>
			</section>
    </main>
  );
}
