import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NewArrivalsSection } from "@/components/newArrivals";
import {Breadcrumbs, Breadcrumb} from '@/components/ui/breadcrumb';
import { ProductPurchasePanel } from "@/components/productPurchasePanel";
import type { Product, ProductBySlug } from "@/entities/domain";
import { getProductGalleryImagePaths } from "@/entities/domain";

type ProductPageSectionProps = {
  product: ProductBySlug;
  recommendedProducts: Promise<Product[]>;
};

export function ProductPageSection({ product, recommendedProducts }: ProductPageSectionProps) {
	const apiUrl = process.env.API_URL ?? "";
	const gallerySrcs = getProductGalleryImagePaths(product).map(
		(path) => `${apiUrl}${path}`
	);

  return (
    <main className="w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
      <section className="section-layout">
				<Breadcrumbs>
					<Breadcrumb href="/">Главаная</Breadcrumb>
					<Breadcrumb href={`/catalog?category=${product.category.Alias}`}>{product.category.Title}</Breadcrumb>
					<Breadcrumb href={`/catalog?category=${product.category.Alias}&sub_category=${product.sub_category.UID}`}>
					  {product.sub_category.Title.toLowerCase()}
					</Breadcrumb>
					<Breadcrumb>{product.brand.Title.toLowerCase()}</Breadcrumb>
				</Breadcrumbs>
      </section>

      <section className="section-layout mt-5">
        <div className="w-full flex gap-10">

          <div className="w-1/2">
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {gallerySrcs.map((src, index) => (
                  <CarouselItem key={`${src}-${index}`} className="pl-0 basis-full">
                    <div className="w-full aspect-530/508 relative lg:h-[623px] lg:aspect-auto">
                      <Image
                        src={src}
                        alt={`${product.Title} — фото ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 1024px) 649px, (min-width: 768px) 649px, 320px"
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </section>

			<section className="section-layout">
				<div className="max-w-3xl mt-10">
					<h2 className="font-serif font-medium text-foreground">Описание:</h2>
					<p className="typo-product-description font-serif font-normal text-card-foreground">{product.Description}</p>
				</div>
			</section>

      <NewArrivalsSection title="Рекомендации" products={recommendedProducts} />
    </main>
  );
}
