import { cache } from "react";
import { query } from "@/app/layout";
import { gql } from "@apollo/client";
import type { 
	CategoriesQueryResponse, 
	SubCategoriesQueryResponse,
	SubCategory
} from "@/entities/domain";

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      Title
      Alias
    }
  }
`;

export const fetchCategories = cache(async (): Promise<CategoriesQueryResponse> => {
  const { data } = await query<CategoriesQueryResponse>({
    query: CATEGORIES_QUERY,
  });

  if (!data) throw new Error("Failed to fetch categories");

  return data;
});

const SUBCATEGORIES_QUERY = gql`
  query SubCategories {
    subCategories {
      Title
      UID
    }
  }
`;

export const fetchSubCategories = cache(async (): Promise<SubCategory[]> => {
  const { data } = await query<SubCategoriesQueryResponse>({
    query: SUBCATEGORIES_QUERY,
  });

  if (!data) throw new Error("Failed to fetch subcategories");

  return data.subCategories;
});