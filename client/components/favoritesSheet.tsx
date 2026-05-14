"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { BADGES } from "@/entities/domain";

const apiUrl = process.env.API_URL;

export function FavoritesSheet() {
	const { state, isOpen, setOpen, remove, clear, totalQuantity } =
		useFavorites();

	const [swiper, setSwiper] = useState<SwiperType | null>(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	const updateNav = (s: SwiperType) => {
		setIsBeginning(s.isBeginning);
		setIsEnd(s.isEnd);
	};

	return (
		<Sheet open={isOpen} onOpenChange={setOpen}>
			<SheetContent
				side="top"
				className="h-auto max-h-[90vh] overflow-y-auto bg-background"
			>
				<SheetHeader className="section-layout flex w-full flex-row items-baseline justify-between pt-10 md:pt-12">
					<SheetTitle className="font-serif text-2xl font-medium">
						Избранное
					</SheetTitle>
					<SheetDescription className="text-sm text-muted-foreground">
						Товаров: {totalQuantity}
					</SheetDescription>
				</SheetHeader>

				<div className="section-layout pb-10">
					{state.items.length === 0 ? (
						<div className="flex flex-col items-center gap-4 py-16">
							<p className="font-serif text-xl">
								В избранном пока ничего нет
							</p>
							<p className="text-sm text-muted-foreground">
								Сохраняйте понравившиеся товары, нажимая на сердечко.
							</p>
							<Link href="/catalog" onClick={() => setOpen(false)}>
								<Button variant="default">Перейти в каталог</Button>
							</Link>
						</div>
					) : (
						<div className="favorites-swiper-wrap relative px-10 md:px-12">
							<Swiper
								modules={[A11y]}
								onSwiper={(s) => {
									setSwiper(s);
									updateNav(s);
								}}
								onSlideChange={updateNav}
								onResize={updateNav}
								onBreakpoint={updateNav}
								spaceBetween={16}
								slidesPerView={1.2}
								breakpoints={{
									640: { slidesPerView: 2.2, spaceBetween: 16 },
									768: { slidesPerView: 3.2, spaceBetween: 20 },
									1024: { slidesPerView: 4, spaceBetween: 24 },
								}}
								className="px-1"
							>
								{state.items.map((product) => (
									<SwiperSlide key={product.documentId}>
										<article className="w-full h-full flex flex-col text-card-foreground bg-card/40">
											<Link
												href={`/product/${product.documentId}`}
												onClick={() => setOpen(false)}
												className="relative block aspect-4/5 overflow-hidden"
											>
												<Image
													src={`${apiUrl}${product.MainImg?.url ?? "/productWallet.png"}`}
													alt={product.Title}
													fill
													sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 80vw"
													className="object-cover"
												/>
											</Link>
											<div className="flex flex-col gap-2 p-2">
												<span className="text-sm text-muted-foreground">
													{BADGES[product.Badge as keyof typeof BADGES]}
												</span>
												<div>
													<h3 className="font-semibold text-lg leading-6 capitalize">
														{product.brand?.Title ?? "Versachi"}
													</h3>
													<p className="font-serif text-sm truncate">
														{product.Title}
													</p>
												</div>
												<div className="mt-2 flex items-center justify-between">
													<span className="text-lg">{product.Price} ₽</span>
													<button
														type="button"
														aria-label="Удалить из избранного"
														onClick={() => remove(product.documentId)}
														className="inline-flex items-center justify-center text-muted-foreground"
													>
														<Trash2 className="size-5" />
													</button>
												</div>
											</div>
										</article>
									</SwiperSlide>
								))}
							</Swiper>

							<button
								type="button"
								aria-label="Предыдущий слайд"
								aria-disabled={isBeginning}
								onClick={() => swiper?.slidePrev()}
								className="favorites-swiper-nav left-0"
							>
								<ChevronLeft className="size-5" />
							</button>
							<button
								type="button"
								aria-label="Следующий слайд"
								aria-disabled={isEnd}
								onClick={() => swiper?.slideNext()}
								className="favorites-swiper-nav right-0"
							>
								<ChevronRight className="size-5" />
							</button>

							<div className="mt-6 flex items-center justify-between border-t border-border pt-4">
								<button
									type="button"
									onClick={clear}
									className="text-sm text-muted-foreground"
								>
									Очистить избранное
								</button>
								<Link href="/catalog" onClick={() => setOpen(false)}>
									<Button variant="outline">В каталог</Button>
								</Link>
							</div>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
