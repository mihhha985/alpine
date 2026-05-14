export type Image = {
  url: string;
}

export type Brand = {
	Title: string;
	Slug: string;
}

export type Size = {
	Title: string;
	Order: number;
}

export type Color = {
	HEX: string;
}

export type Sizes = {
	Title: string;
}

export type Category = {
	Title: string;
	Alias: string;
}

export interface CategoriesQueryResponse {
  categories: Category[];
}

export interface SortedCategory {
  title: string;
  alias: string;
}

export type SubCategory = {
  Title: string;
  UID: string;
}

export interface SubCategoriesQueryResponse {
  subCategories: SubCategory[];
}

export interface Product {
	documentId: string;
  Title: string;
	Price: string;
	MainImg: Image | null;
	Badge: string;
	brand: Brand;
}

export interface ProductQueryResponse {
	products: Product[];
}

/** Метаданные пагинации Strapi GraphQL (products_connection.pageInfo) */
export interface CatalogPageInfo {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}

export interface CatalogProductsConnectionResponse {
	products_connection: {
		nodes: Product[];
		pageInfo: CatalogPageInfo;
	};
}

/** Результат загрузки страницы каталога */
export type CatalogProductsPage = {
	products: Product[];
	pageInfo: CatalogPageInfo;
};

export interface ProductBySlug extends Product {
	Description: string;
	sizes: Size[];
	colors: Color[];
	Images: Image[] | null;
	category: Category;
	sub_category: SubCategory;
}

export interface ProductBySlugQueryResponse {
	product: ProductBySlug | null;
}

export interface CartItem {
	id: string;
	documentId: string;
	Title: string;
	Price: string;
	MainImg: Image | null;
	brand: Brand;
	Badge: string;
	size: Size | null;
	color: Color | null;
	quantity: number;
}

export function makeCartItemId(
	documentId: string,
	size: Size | null,
	color: Color | null,
): string {
	return `${documentId}__${size?.Title ?? "_"}__${color?.HEX ?? "_"}`;
}

export const BADGES = {
	eksklyuziv: "эксклюзив",
	novaya_kollekcziya: "новая коллекция",
} as const;

/** Пути изображений галереи: главное без дублей из Images, затем остальные из Images. */
export function getProductGalleryImagePaths(product: ProductBySlug): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	const push = (url: string | undefined) => {
		if (!url || seen.has(url)) return;
		seen.add(url);
		out.push(url);
	};
	push(product.MainImg?.url);
	for (const img of product.Images ?? []) {
		push(img.url);
	}
	return out.length > 0 ? out : ["/productWallet.png"];
}