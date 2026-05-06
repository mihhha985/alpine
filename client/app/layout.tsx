import type { Metadata } from "next";
import { SiteHeader } from "@/components/siteHeader";
import { SiteFooter } from "@/components/siteFooter";
import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { sortedData } from "@/entities/services/sortedData";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // Use an absolute URL for SSR (relative URLs cannot be used in SSR)
      uri: "http://localhost:1337/graphql",
    }),
  });
});
import { 
	Bodoni_Moda, 
	Montserrat, 
	Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alpine — аксессуары и кожаные изделия",
  description: "Минималистичный магазин Alpine: кожа, лаконичные формы и монохромная эстетика.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await sortedData();

  return (
    <html
      lang="ru"
      className={cn("h-full", "antialiased", montserrat.variable, playfairDisplay.variable, bodoniModa.variable, "font-sans", geist.variable)}
    >
      <body>
        <SiteHeader categories={categories} />
        {children}
        <SiteFooter categories={categories} />
      </body>
    </html>
  );
}
