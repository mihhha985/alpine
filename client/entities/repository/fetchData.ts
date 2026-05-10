"use server"
import { query } from "@/app/layout";
import { gql } from "@apollo/client";
import type {
	ProductQueryResponse,
	Product,
	ProductBySlugQueryResponse,
	ProductBySlug,
	CatalogProductsConnectionResponse,
	CatalogProductsPage,
} from "@/entities/domain";

const productListFragment = gql`
  fragment CatalogProductFields on Product {
    documentId
    Title
    Price
    Description
    MainImg {
      url
    }
    Badge
    brand {
      Title
      Slug
    }
  }
`;

const CATALOG_PRODUCTS_QUERY = gql`
  query CatalogProducts(
    $filters: ProductFiltersInput
    $pageSize: Int!
    $page: Int!
  ) {
    products_connection(
      filters: $filters
      sort: ["createdAt:desc"]
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      nodes {
        ...CatalogProductFields
      }
      pageInfo {
        page
        pageSize
        pageCount
        total
      }
    }
  }
  ${productListFragment}
`;

export type FetchCatalogProductsOptions = {
	categoryAlias?: string;
	subCategoryUid?: string;
	brandSlugs?: string[];
	sizeTitles?: string[];
	colorHex?: string;
	priceFrom?: number;
	priceTo?: number;
	pageSize?: number;
	page?: number;
};

type ProductFilters = Record<string, unknown>;

function buildProductFilters(opts: FetchCatalogProductsOptions): ProductFilters | undefined {
	const filters: ProductFilters = {};

	if (opts.categoryAlias) {
		filters.category = { Alias: { eq: opts.categoryAlias } };
	}
	if (opts.subCategoryUid) {
		filters.sub_category = { UID: { eq: opts.subCategoryUid } };
	}
	if (opts.brandSlugs && opts.brandSlugs.length > 0) {
		filters.brand = { Slug: { in: opts.brandSlugs } };
	}
	if (opts.sizeTitles && opts.sizeTitles.length > 0) {
		filters.sizes = { Title: { in: opts.sizeTitles } };
	}
	if (opts.colorHex) {
		filters.colors = { HEX: { eq: opts.colorHex } };
	}

	const priceRange: Record<string, number> = {};
	if (typeof opts.priceFrom === "number" && Number.isFinite(opts.priceFrom)) {
		priceRange.gte = opts.priceFrom;
	}
	if (typeof opts.priceTo === "number" && Number.isFinite(opts.priceTo)) {
		priceRange.lte = opts.priceTo;
	}
	if (Object.keys(priceRange).length > 0) {
		filters.Price = priceRange;
	}

	return Object.keys(filters).length > 0 ? filters : undefined;
}

export async function fetchCatalogProducts(
	options: FetchCatalogProductsOptions = {},
): Promise<CatalogProductsPage> {
	const pageSize = options.pageSize ?? 12;
	const page = options.page ?? 1;
	const filters = buildProductFilters(options);

	const { data } = await query<CatalogProductsConnectionResponse>({
		query: CATALOG_PRODUCTS_QUERY,
		variables: {
			filters,
			pageSize,
			page,
		},
	});

	if (!data?.products_connection) {
		throw new Error("Failed to fetch catalog products");
	}

	return {
		products: data.products_connection.nodes,
		pageInfo: data.products_connection.pageInfo,
	};
}

export type FetchProductsBySearchOptions = {
	categoryAlias?: string;
	pageSize?: number;
	page?: number;
};

export async function fetchProductsBySearch(
	searchTerm: string,
	options: FetchProductsBySearchOptions = {},
): Promise<CatalogProductsPage> {
	const pageSize = options.pageSize ?? 12;
	const page = options.page ?? 1;
	const q = searchTerm.trim();

	const filters: ProductFilters = {
		or: [
			{ Title: { containsi: q } },
			{ Description: { containsi: q } },
		],
	};
	if (options.categoryAlias) {
		filters.category = { Alias: { eq: options.categoryAlias } };
	}

	const { data } = await query<CatalogProductsConnectionResponse>({
		query: CATALOG_PRODUCTS_QUERY,
		variables: { filters, pageSize, page },
	});

	if (!data?.products_connection) {
		throw new Error("Failed to search products");
	}

	return {
		products: data.products_connection.nodes,
		pageInfo: data.products_connection.pageInfo,
	};
}

const ALL_PRODUCTS_QUERY = gql`
  query AllProducts($pageSize: Int!, $page: Int!) {
    products(
      sort: ["createdAt:desc"]
      pagination: { pageSize: $pageSize, page: $page }
    ) {
			documentId
      Title
      Price
      Description
      MainImg {
        url
      }
      Badge
			brand {
				Title
				Slug
			}
    }
  }
`;

export const fetchAllProducts = async (pageSize: number = 12, page: number = 1): Promise<Product[]> => {
  const { data } = await query<ProductQueryResponse>({
    query: ALL_PRODUCTS_QUERY,
    variables: {pageSize, page},
  });

  if (!data) throw new Error("Failed to fetch products by category");

  return data.products;
};

const PRODUCT_BY_SLUG_QUERY = gql`
  query ProductBySlug($documentId: ID!) {
    product(documentId: $documentId) {
      documentId
			Title
			Price
			Description
			MainImg {
				url
			}
			Images {
				url
			}
			Badge
			brand {
				Title
			}
			sizes {
				Title
				Order
			}
			colors {
				HEX
			}
    }
  }
`;

export const fetchProductBySlug = async (slug: string): Promise<ProductBySlug | null> => {
  const { data } = await query<ProductBySlugQueryResponse>({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: {documentId: slug},
  });

  if (!data) throw new Error("Failed to fetch product by slug");

  return data.product;
};
