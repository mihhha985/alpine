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
import { 
	fetchSubCategories,
	fetchSizes,
	fetchBrands,
	fetchColors,
} from "@/entities/repository/fetchCategories";

export const metadata: Metadata = {
  title: "Каталог — Alpine",
  description: "Каталог товаров Alpine: кожаные аксессуары и изделия в монохромной эстетике.",
};

type CatalogSearchParams = {
  category?: string | string[];
  sub?: string | string[];
  page?: string | string[];
  brands?: string | string[];
  sizes?: string | string[];
  color?: string | string[];
  priceFrom?: string | string[];
  priceTo?: string | string[];
};

function firstSearchParam(
	value: string | string[] | undefined,
): string | undefined {
	if (value === undefined) return undefined;
	const raw = Array.isArray(value) ? value[0] : value;
	return raw !== undefined && raw !== "" ? raw : undefined;
}

function listSearchParam(
	value: string | string[] | undefined,
): string[] {
	if (value === undefined) return [];
	const arr = Array.isArray(value) ? value : [value];
	return arr.filter((v) => v !== "");
}

function parsePage(raw: string | undefined): number {
	if (raw === undefined || raw === "") return 1;
	const n = Number.parseInt(raw, 10);
	if (!Number.isFinite(n) || n < 1) return 1;
	return n;
}

function parsePrice(raw: string | undefined): number | undefined {
	if (raw === undefined || raw === "") return undefined;
	const n = Number(raw);
	return Number.isFinite(n) ? n : undefined;
}

export default async function CatalogPage({
	searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
	const params = await searchParams;

	const category = firstSearchParam(params.category);
	const subCategory = firstSearchParam(params.sub);
	const page = parsePage(firstSearchParam(params.page));
	const brandSlugs = listSearchParam(params.brands);
	const sizeTitles = listSearchParam(params.sizes);
	const colorHex = firstSearchParam(params.color);
	const priceFrom = parsePrice(firstSearchParam(params.priceFrom));
	const priceTo = parsePrice(firstSearchParam(params.priceTo));

	const [
		{ products, pageInfo },
		categories,
		subCategories,
		sizes,
		brands,
		colors,
	] = await Promise.all([
		fetchCatalogProducts({
			...(category !== undefined ? { categoryAlias: category } : {}),
			...(subCategory !== undefined ? { subCategoryUid: subCategory } : {}),
			...(brandSlugs.length > 0 ? { brandSlugs } : {}),
			...(sizeTitles.length > 0 ? { sizeTitles } : {}),
			...(colorHex !== undefined ? { colorHex } : {}),
			...(priceFrom !== undefined ? { priceFrom } : {}),
			...(priceTo !== undefined ? { priceTo } : {}),
			page,
		}),
		sortedData(),
		fetchSubCategories(),
		fetchSizes(),
		fetchBrands(),
		fetchColors(),
	]);

	if (pageInfo.pageCount > 0 && page > pageInfo.pageCount) {
		redirect(catalogPageHref(params, pageInfo.pageCount));
	}

  return (
    <main className="flex flex-col pt-[40px] md:pt-[80px]">
      <CatalogToolbarSection 
				activeCategory={category}
				activeSubCategory={subCategory}
				categories={categories}
				subCategories={subCategories} 
				sizes={sizes}
				brands={brands}
				colors={colors}
			/>
      <CatalogGridSection products={products} />
			<PaginationSection
				pageInfo={pageInfo}
				searchParams={params}
			/>
    </main>
  );
}
