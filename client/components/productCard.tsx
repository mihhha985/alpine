import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import {BADGES} from "@/entities/domain";
import type { Product } from "@/entities/domain";

const CARD_IMAGE_BLUR =
	"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export function ProductCard({product}: {product: Product}) {
  return (
    	<Link 
				href={`/product/${product.documentId}`} 
				className={`w-full h-full flex flex-col min-h-0 text-card-foreground bg-card/40 shadow-2xs hover:bg-card/80 hover:shadow-sm`}>

				<div className="relative aspect-4/5 overflow-hidden">
					<Image
						src={`${process.env.API_URL}${product.MainImg?.url ?? "/productWallet.png"}`}
						alt={product.Title}
						placeholder="blur"
						blurDataURL={CARD_IMAGE_BLUR}
						quality={75}
						fill
						sizes="(min-width: 1024px) 271px, (min-width: 640px) 33vw, 100vw"
						className="object-cover"
					/>
					<span className="absolute right-2 top-2 inline-flex text-muted-foreground" aria-hidden>
						<Heart className="size-[25px]" strokeWidth={1.5} fill="currentColor" />
					</span>
				</div>

				<div className="flex-1 flex flex-col min-h-0 p-2 gap-2">
					<span className="text-sm text-muted-foreground">
						{BADGES[product.Badge as keyof typeof BADGES]}
					</span>
					<div>
						<h3 className="font-semibold text-lg leading-6">{product.brand?.Title ?? "Versachi"}</h3>
						<p className="font-serif text-sm">{product.Title}</p>
					</div>

					<h4 className="mt-auto text-lg">Цена: {product.Price} ₽</h4>
				</div>

			</Link>
  );
}
