import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ProductPageSection } from "@/components/productSection";
import { fetchProductBySlug, fetchAllProducts } from "@/entities/repository/fetchData";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

//caching the product data for metadata generation
const getProduct = cache(async (slug: string) => fetchProductBySlug(slug));

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

  return {
    title: `${product.Title} — Alpine`,
    description: `${product.Title}: ${product.Description}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
	console.log(product);
	if (!product) {
		notFound();
	}

	const recommendedProducts = fetchAllProducts(4, 1);

  return (
    <ProductPageSection product={product} recommendedProducts={recommendedProducts} />
  );
}
