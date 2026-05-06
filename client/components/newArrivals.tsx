"use client"
import { use } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/productCard";
import { Skeleton } from "./ui/skeleton";
import type { Product } from "@/entities/domain";
interface NewArrivalsSectionProps {
	title: string;
  products: Promise<Product[]>;
}

export function NewArrivalsSection({ title, products }: NewArrivalsSectionProps) {
  const productsData = use(products);
	
  return (
    <section className="section">
      <div className="section-layout flex flex-col gap-10 py-10 lg:gap-12 lg:py-12">
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
              <h2 className="font-serif font-medium">
                {title}
              </h2>
              <Button variant="outline" className="hidden self-start lg:inline-flex">
                Посмотреть подборку
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {productsData.map((product) => (
                <ProductCard key={product.documentId} product={product} />
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}

export function NewArrivalsLoading() {
  return (
    <section className="section py-10">
      <div className="section-layout">
        <Skeleton variant="text" className="max-w-md mb-8" />
				<div className="grid grid-cols-4 gap-8">
					<Skeleton className="aspect-3/4" />
					<Skeleton className="aspect-3/4" />
					<Skeleton className="aspect-3/4" />
					<Skeleton className="aspect-3/4" />
				</div>
      </div>
    </section>
  );
}
