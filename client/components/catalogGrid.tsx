import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/productCard";
import type { Product } from "@/entities/domain";

export function CatalogGridSection({ products }: { products: Product[] }) {
	if (products.length === 0) {
		return (
			<section className="section w-full">
				<div className="w-full h-[40vh] flex justify-center items-center">
					<h3>Не найденно товаров по заданным параметрам</h3>
				</div>
			</section>
		)
	}

  return (
    <section className="section w-full">
      <div className="section-layout">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>

        <div className="flex w-full flex-col items-center my-10">
          <Button variant="outline">
            Посмотреть подборку
          </Button>
        </div>
      </div>
    </section>
  );
}
