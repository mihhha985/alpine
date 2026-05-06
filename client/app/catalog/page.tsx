import type { Metadata } from "next";
import { CatalogGridSection } from "@/components/catalogGrid";
import { CatalogToolbarSection } from "@/components/catalogToolbar";
import { PaginationSection } from "@/components/PaginationSection";
import { fetchCatalogProducts } from "@/entities/repository/fetchData";
import { sortedData } from "@/entities/services/sortedData";
import { fetchSubCategories } from "@/entities/repository/fetchCategories";
import type { Product } from "@/entities/domain";

export const metadata: Metadata = {
  title: "Каталог — Alpine",
  description: "Каталог товаров Alpine: кожаные аксессуары и изделия в монохромной эстетике.",
};

type CatalogSearchParams = {
  category?: string | string[];
  sub?: string | string[];
};

function firstSearchParam(
	value: string | string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogPage({
	searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
	const params = await searchParams;

	const category = firstSearchParam(params.category);
	const sub_category = firstSearchParam(params.sub);

	const products: Product[] = await fetchCatalogProducts({
		...(category !== undefined ? { categoryAlias: category } : {}),
		...(sub_category !== undefined ? { subCategoryUid: sub_category } : {}),
	});
  
	const categories = await sortedData(); 
	const subCategories = await fetchSubCategories();

  return (
    <main className="flex flex-col pt-[40px] md:pt-[80px]">
      <CatalogToolbarSection 
				activeCategory={category}
				activeSubCategory={sub_category}
				categories={categories}
				subCategories={subCategories} 
			/>
      <CatalogGridSection products={products} />
			<PaginationSection category={category} subCategory={sub_category} />
    </main>
  );
}
