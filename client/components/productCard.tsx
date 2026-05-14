"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { BADGES } from "@/entities/domain";
import type { Product } from "@/entities/domain";
import { useFavorites } from "@/hooks/useFavorites";
import defaultCardPlaceholder from "@/public/default.png";

export function ProductCard({ product }: { product: Product }) {
	const { isFavorite, toggle } = useFavorites();
	const favorite = isFavorite(product.documentId);

	return (
		<Link
			href={`/product/${product.documentId}`}
			className={`w-full h-full flex flex-col min-h-0 text-card-foreground bg-card/40 shadow-2xs hover:bg-card/80 hover:shadow-sm`}
		>
			<div className="relative aspect-4/5 overflow-hidden">
				<Image
					src={`${process.env.API_URL}${product.MainImg?.url ?? "/productWallet.png"}`}
					alt={product.Title}
					placeholder="blur"
					blurDataURL={defaultCardPlaceholder.blurDataURL}
					quality={75}
					fill
					sizes="(min-width: 1024px) 271px, (min-width: 640px) 33vw, 100vw"
					className="object-cover"
				/>
				<button
					type="button"
					aria-label={
						favorite ? "Убрать из избранного" : "Добавить в избранное"
					}
					aria-pressed={favorite}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggle(product);
					}}
					className={`absolute right-2 top-2 inline-flex items-center justify-center ${
						favorite ? "text-primary" : "text-muted-foreground"
					}`}
				>
					<Heart
						className="size-[25px]"
						strokeWidth={1.5}
						fill={favorite ? "currentColor" : "none"}
					/>
				</button>
			</div>

			<div className="flex-1 flex flex-col min-h-0 p-2 gap-2">
				<span className="text-sm text-muted-foreground">
					{BADGES[product.Badge as keyof typeof BADGES]}
				</span>
				<div>
					<h3 className="font-semibold text-lg leading-6">
						{product.brand?.Title ?? "Versachi"}
					</h3>
					<p className="font-serif text-sm">{product.Title}</p>
				</div>

				<h4 className="mt-auto text-lg">Цена: {product.Price} ₽</h4>
			</div>
		</Link>
	);
}
