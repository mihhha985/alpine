import { HeroSection } from "@/components/heroSection";
import { NewArrivalsSection, NewArrivalsLoading } from "@/components/newArrivals";
import { ContactSection } from "@/components/contactSection";
import { Suspense } from 'react'
import { fetchCatalogProducts } from "@/entities/repository/fetchData";

export default function Home() {
  const forManproducts = fetchCatalogProducts({ categoryAlias: "man", limit: 4 });
	const forWomanproducts = fetchCatalogProducts({ categoryAlias: "women", limit: 4 });
	const forChildproducts = fetchCatalogProducts({ categoryAlias: "kids", limit: 4 });

  return (
    <main className="flex flex-col">
      <HeroSection />
      <Suspense fallback={<NewArrivalsLoading />}>
        <NewArrivalsSection
          title="Для мужчин - новинки из коллекций лучших брендов"
          products={forManproducts}
        />
      </Suspense>
			<Suspense fallback={<NewArrivalsLoading />}>
        <NewArrivalsSection
          title="Для женщин - новинки из коллекций лучших брендов"
          products={forWomanproducts}
        />
      </Suspense>
			<Suspense fallback={<NewArrivalsLoading />}>
        <NewArrivalsSection
          title="Для детей - новинки из коллекций лучших брендов"
          products={forChildproducts}
        />
      </Suspense>
      <ContactSection />
    </main>
  );
}
