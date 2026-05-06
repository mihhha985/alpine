import Image from "next/image";
import { Button } from "@/components/ui/button";
import { NewArrivalsSection } from "@/components/newArrivals";
import {Breadcrumbs, Breadcrumb} from '@/components/ui/breadcrumb';
import {TagGroup, Tag} from '@/components/ui/tagGroup';
import {ColorSwatchPicker, ColorSwatchPickerItem} from '@/components/ui/colorSwatchPicker';
import {Label} from "@/components/ui/Field";
import type { Product, ProductBySlug } from "@/entities/domain";
import { BADGES } from "@/entities/domain";

type ProductPageSectionProps = {
  product: ProductBySlug;
  recommendedProducts: Promise<Product[]>;
};

export function ProductPageSection({ product, recommendedProducts }: ProductPageSectionProps) {
  return (
    <main className="w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
      <section className="section-layout">
				<Breadcrumbs>
					<Breadcrumb href="/">Главаная</Breadcrumb>
					<Breadcrumb href="/catalog">Каталог</Breadcrumb>
					<Breadcrumb>{product.brand.Title}</Breadcrumb>
				</Breadcrumbs>
      </section>

      <section className="section-layout mt-5">
        <div className="w-full flex gap-10">

          <div className="w-1/2">
            <div className="w-full aspect-530/508 relative lg:h-[623px] lg:aspect-auto">
              <Image
                src={`${process.env.API_URL}${product.MainImg?.url ?? "/productWallet.png"}`}
                alt={product.Title}
                fill
                priority
                sizes="(min-width: 1024px) 649px, (min-width: 768px) 649px, 320px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-1/2 flex flex-col gap-4 py-5">
						<div className="flex flex-col min-h-0 p-2 gap-2">
							<span className="text-lg text-muted-foreground">
								{BADGES[product.Badge as keyof typeof BADGES]}
							</span>
							<div>
								<h3 className="font-semibold text-2xl leading-6 capitalize">{product.brand?.Title ?? "Versachi"}</h3>
								<p className="font-serif text-lg">{product.Title}</p>
							</div>
							<h4 className="mt-auto text-lg">Цена: {product.Price} ₽</h4>
						</div>

						<TagGroup
							color="gray"
							label="Размеры:"
							selectionMode="single">
							{product.sizes && product.sizes.map(item => 
								<Tag key={item.Title}>{item.Title}</Tag>
							)}
						</TagGroup>

						<div>
							<Label>Цвета:</Label>
							<ColorSwatchPicker aria-label="Background color">
								{product.colors && product.colors.map(color => 
									<ColorSwatchPickerItem key={color.HEX} color={color.HEX} />
								)}
							</ColorSwatchPicker>
						</div>

						<div className="mt-auto">
							<div className="w-full flex flex-col gap-[10px] md:flex-row md:items-start">
								<Button variant="primary">Добавить в корзину</Button>
								<Button variant="outline">Избранное</Button>
							</div>

							<p className="w-full max-w-[335px] font-sans font-normal leading-[1.2] text-foreground mt-2">
								Примерная дата доставки:
								<br />
								17 окт. - 24 окт.
							</p>
						</div>
          </div>
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
