"use server"
import { query } from "@/app/layout";
import { gql } from "@apollo/client";
import type { 
	ProductQueryResponse, 
	Product,
	ProductBySlugQueryResponse,
	ProductBySlug
} from "@/entities/domain";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  }
`;

// fetch products by category (and optionally sub_category UID)
const PRODUCTS_BY_CATEGORY_QUERY = gql`
  query ProductsByCategory($categoryAlias: String!, $pageSize: Int!, $page: Int!) {
    products(
      filters: { category: { Alias: { eq: $categoryAlias } } }
      sort: ["createdAt:desc"]
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      ...CatalogProductFields
    }
  }
  ${productListFragment}
`;

const PRODUCTS_BY_CATEGORY_AND_SUB_QUERY = gql`
  query ProductsByCategoryAndSub(
    $categoryAlias: String!
    $subCategoryUid: String!
    $pageSize: Int!
    $page: Int!
  ) {
    products(
      filters: {
        category: { Alias: { eq: $categoryAlias } }
        sub_category: { UID: { eq: $subCategoryUid } }
      }
      sort: ["createdAt:desc"]
      pagination: { pageSize: $pageSize, page: $page }
    ) {
      ...CatalogProductFields
    }
  }
  ${productListFragment}
`;

export type FetchCatalogProductsOptions = {
	categoryAlias?: string;
	subCategoryUid?: string;
	pageSize?: number;
	page?: number;
};

export async function fetchCatalogProducts(
	options: FetchCatalogProductsOptions = {},
): Promise<Product[]> {
	const categoryAlias = options.categoryAlias ?? "man";
	const subCategoryUid = options.subCategoryUid?.trim();
	const pageSize = options.pageSize ?? 12;
	const page = options.page ?? 1;

	if (subCategoryUid) {
		const { data } = await query<ProductQueryResponse>({
			query: PRODUCTS_BY_CATEGORY_AND_SUB_QUERY,
			variables: {
				categoryAlias,
				subCategoryUid,
				pageSize,
				page
			},
		});
		if (!data) {
			throw new Error("Failed to fetch products by category and subcategory");
		}
		return data.products;
	}

	const { data } = await query<ProductQueryResponse>({
		query: PRODUCTS_BY_CATEGORY_QUERY,
		variables: {
			categoryAlias,
			pageSize,
			page
		},
	});
	if (!data) throw new Error("Failed to fetch products by category");

	return data.products;
}

//fetch all products with pagination
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

//fetch product by slug
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
			}
			colors {
				HEX
			}
    }
  }
`;

export const fetchProductBySlug = async (slug: string): Promise<ProductBySlug | null> => {
	//await delay(1000);
  const { data } = await query<ProductBySlugQueryResponse>({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: {documentId: slug},
  });

  if (!data) throw new Error("Failed to fetch product by slug");

  return data.product;
};