type Image = {
  url: string;
}

type Brand = {
	Title: string;
	Slug: string;
}

type Size = {
	Title: string;
}

type Color = {
	HEX: string;
}

export interface CategoriesQueryResponse {
  categories: {
    Title: string;
    Alias: string;
  }[];
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

export interface ProductBySlug extends Product {
	Description: string;
	sizes: Size[];
	colors: Color[];
	Images: Image[] | null;
}

export interface ProductBySlugQueryResponse {
	product: ProductBySlug | null;
}

export const BADGES = {
	eksklyuziv: "эксклюзив",
	novaya_kollekcziya: "новая коллекция",
} as const;