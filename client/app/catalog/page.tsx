import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CatalogGridSection } from "@/components/catalogGrid";
import { CatalogToolbarSection } from "@/components/catalogToolbar";
import {
	PaginationSection,
	catalogPageHref,
} from "@/components/PaginationSection";
import { fetchCatalogProducts } from "@/entities/repository/fetchData";
import { sortedData } from "@/entities/services/sortedData";
import { fetchSubCategories } from "@/entities/repository/fetchCategories";
export const metadata: Metadata = {
  title: "Каталог — Alpine",
  description: "Каталог товаров Alpine: кожаные аксессуары и изделия в монохромной эстетике.",
};

type CatalogSearchParams = {
  category?: string | string[];
  sub?: string | string[];
  page?: string | string[];
};

function firstSearchParam(
	value: string | string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	return Array.isArray(value) ? value[0] : value;
}

function parsePage(raw: string | undefined): number {
	if (raw === undefined || raw === "") return 1;
	const n = Number.parseInt(raw, 10);
	if (!Number.isFinite(n) || n < 1) return 1;
	return n;
}

export default async function CatalogPage({
	searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
	const params = await searchParams;

	const category = firstSearchParam(params.category);
	const sub_category = firstSearchParam(params.sub);
	const page = parsePage(firstSearchParam(params.page));

	const { products, pageInfo } = await fetchCatalogProducts({
		...(category !== undefined ? { categoryAlias: category } : {}),
		...(sub_category !== undefined ? { subCategoryUid: sub_category } : {}),
		page,
	});

	if (pageInfo.pageCount > 0 && page > pageInfo.pageCount) {
		redirect(
			catalogPageHref({
				page: pageInfo.pageCount,
				category,
				subCategory: sub_category,
			}),
		);
	}

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
			<PaginationSection
				pageInfo={pageInfo}
				category={category}
				subCategory={sub_category}
			/>
    </main>
  );
}
