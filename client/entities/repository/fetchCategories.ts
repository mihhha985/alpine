import { cache } from "react";
import { query } from "@/app/layout";
import { gql } from "@apollo/client";
import type { 
	CategoriesQueryResponse, 
	SubCategoriesQueryResponse,
	SubCategory,
	Size,
	Brand,
	Color,
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

const SIZES_QUERY = gql`
  query Sizes {
    sizes {
      Title
    }
  }
`;

type SizesQueryResponse = {
  sizes: Size[];
}

export const fetchSizes = cache(async (): Promise<Size[]> => {
  const { data } = await query<SizesQueryResponse>({
    query: SIZES_QUERY,
  });

  if (!data) throw new Error("Failed to fetch sizes");

  return data.sizes;
});

const BRANDS_QUERY = gql`
  query Brands {
    brands {
      Title
      Slug
    }
  }
`;

type BrandsQueryResponse = {
  brands: Brand[];
}

export const fetchBrands = cache(async (): Promise<Brand[]> => {
  const { data } = await query<BrandsQueryResponse>({
    query: BRANDS_QUERY,
  });

  if (!data) throw new Error("Failed to fetch brands");

  return data.brands;
});

const COLORS_QUERY = gql`
  query Colors {
    colors {
      HEX
    }
  }
`;

type ColorsQueryResponse = {
  colors: Color[];
}

export const fetchColors = cache(async (): Promise<Color[]> => {
  const { data } = await query<ColorsQueryResponse>({
    query: COLORS_QUERY,
  });

  if (!data) throw new Error("Failed to fetch colors");

  return data.colors;
});