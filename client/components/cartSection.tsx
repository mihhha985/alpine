"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const apiUrl = process.env.API_URL;

function formatPrice(value: number): string {
	return new Intl.NumberFormat("ru-RU", {
		maximumFractionDigits: 0,
	}).format(value);
}

export function CartSection() {
	const { state, dispatch, totalQuantity, totalPrice } = useCart();

	if (state.items.length === 0) {
		return (
			<main className="min-h-[65vh] w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
				<section className="section-layout flex flex-col items-center gap-4 py-20">
					<h1 className="font-serif text-2xl">Ваша корзина пуста</h1>
					<p className="text-muted-foreground">
						Загляните в каталог — там точно найдётся что-то для вас.
					</p>
					<Link href="/catalog">
						<Button variant="default">Перейти в каталог</Button>
					</Link>
				</section>
			</main>
		);
	}

	return (
		<main className="min-h-[65vh] w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
			<section className="section-layout flex flex-col gap-6 py-10">
				<div className="flex items-baseline justify-between">
					<h1 className="font-serif text-2xl">Корзина</h1>
					<span className="text-sm text-muted-foreground">
						Товаров: {totalQuantity}
					</span>
				</div>

				<ul className="flex flex-col gap-4">
					{state.items.map((item) => (
						<li
							key={item.id}
							className="flex gap-4 border border-border rounded-lg p-3"
						>
							<div className="relative w-[120px] h-[140px] shrink-0 bg-muted">
								<Image
									src={`${apiUrl}${item.MainImg?.url ?? "/productWallet.png"}`}
									alt={item.Title}
									fill
									sizes="120px"
									className="object-cover"
								/>
							</div>

							<div className="flex-1 flex flex-col gap-2 min-w-0">
								<div className="flex flex-col">
									<h3 className="font-semibold text-lg leading-6 capitalize">
										{item.brand?.Title ?? "Versachi"}
									</h3>
									<p className="font-serif text-sm truncate">{item.Title}</p>
								</div>

								<div className="flex flex-col gap-y-1 text-sm text-muted-foreground">
									<span>Размер: {item.size?.Title ?? "N/A"}</span>
									{item.color && (
										<span className="inline-flex items-center gap-1">
											Цвет:
											<span
												aria-hidden
												className="inline-block w-4 h-4 rounded-full border border-border"
												style={{ backgroundColor: item.color.HEX }}
											/>
										</span>
									)}
								</div>
							</div>

							<div className="flex flex-col items-center justify-between gap-4">
								<div className="inline-flex items-center border border-border rounded-lg">
										<button
											type="button"
											aria-label="Уменьшить количество"
											onClick={() =>
												dispatch({
													type: "DECREMENT",
													payload: { id: item.id },
												})
											}
											className="size-9 inline-flex items-center justify-center"
										>
											<Minus className="size-4" />
										</button>
										<span className="w-8 text-center text-sm font-medium">
											{item.quantity}
										</span>
										<button
											type="button"
											aria-label="Увеличить количество"
											onClick={() =>
												dispatch({
													type: "INCREMENT",
													payload: { id: item.id },
												})
											}
											className="size-9 inline-flex items-center justify-center"
										>
											<Plus className="size-4" />
										</button>
								</div>

								<div className="flex items-center gap-3">
										<span className="text-lg">{item.Price} ₽</span>
										<button
											type="button"
											aria-label="Удалить из корзины"
											onClick={() =>
												dispatch({
													type: "REMOVE",
													payload: { id: item.id },
												})
											}
											className="inline-flex items-center justify-center text-muted-foreground"
										>
											<Trash2 className="size-5" />
										</button>
								</div>
							</div>
						</li>
					))}
				</ul>

				<div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
					<button
						type="button"
						onClick={() => dispatch({ type: "CLEAR" })}
						className="text-sm text-muted-foreground self-start"
					>
						Очистить корзину
					</button>
					<div className="flex items-center gap-6">
						<span className="text-lg">
							Итого: {formatPrice(totalPrice)} ₽
						</span>
						<Link href="/checkout">
							<Button variant="default">Оформить заказ</Button>
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
