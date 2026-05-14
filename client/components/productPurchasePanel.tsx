"use client";
import { useCallback, useMemo, useState } from "react";
import type { Key } from "react-aria-components/TagGroup";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagGroup, Tag } from "@/components/ui/tagGroup";
import {
	ColorSwatchPicker,
	ColorSwatchPickerItem,
} from "@/components/ui/colorSwatchPicker";
import { Label } from "@/components/ui/label";
import type { ProductBySlug } from "@/entities/domain";
import { BADGES } from "@/entities/domain";
import { useCart } from "@/hooks/useCart";

type ProductPurchasePanelProps = {
	product: ProductBySlug;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
	const { dispatch } = useCart();

	const sortedSizes = useMemo(
		() =>
			product.sizes ? [...product.sizes].sort((a, b) => a.Order - b.Order) : [],
		[product.sizes],
	);

	const [selectedSizeTitle, setSelectedSizeTitle] = useState<string | null>(
		null,
	);

	const [selectedColorHex, setSelectedColorHex] = useState<string | null>(
		product.colors?.[0]?.HEX ?? null,
	);
	
	const [quantity, setQuantity] = useState(1);

	const handleSizeChange = useCallback((keys: "all" | Set<Key>) => {
		if (keys === "all") return;
		const first = keys.values().next().value;
		setSelectedSizeTitle(first ? String(first) : null);
	}, []);

	const handleColorChange = useCallback((color: { toString: (format: "hex") => string }) => {
		setSelectedColorHex(color.toString("hex"));
	}, []);

	const decrease = useCallback(() => {
		setQuantity((q) => (q > 1 ? q - 1 : 1));
	}, []);

	const increase = useCallback(() => {
		setQuantity((q) => q + 1);
	}, []);

	const handleAddToCart = useCallback(() => {
		const size =
			sortedSizes.find((s) => s.Title === selectedSizeTitle) ?? null;
		const color =
			product.colors?.find((c) => c.HEX === selectedColorHex) ?? null;

		dispatch({
			type: "ADD",
			payload: { product, size, color, quantity },
		});
		setQuantity(1);
	}, [dispatch, product, quantity, selectedColorHex, selectedSizeTitle, sortedSizes]);

	const selectedSizeKeys = selectedSizeTitle
		? new Set<Key>([selectedSizeTitle])
		: new Set<Key>();

	return (
		<div className="w-1/2 flex flex-col gap-4 py-5">
			<div className="flex flex-col min-h-0 p-2 gap-2">
				<span className="text-lg text-muted-foreground">
					{BADGES[product.Badge as keyof typeof BADGES]}
				</span>
				<div>
					<h3 className="font-semibold text-2xl leading-6 capitalize">
						{product.brand?.Title ?? "Versachi"}
					</h3>
					<p className="font-serif text-lg">{product.Title}</p>
				</div>
				<h4 className="mt-auto text-lg">Цена: {product.Price} ₽</h4>
			</div>

			<TagGroup
				color="gray"
				label="Размеры:"
				selectionMode="single"
				selectedKeys={selectedSizeKeys}
				onSelectionChange={handleSizeChange}
			>
				{sortedSizes.map((item) => (
					<Tag key={item.Title} id={item.Title}>
						{item.Title}
					</Tag>
				))}
			</TagGroup>

			<div className="flex flex-col gap-2">
				<Label>Цвета:</Label>
				<ColorSwatchPicker
					aria-label="Выбор цвета"
					value={selectedColorHex ?? undefined}
					onChange={handleColorChange}
				>
					{product.colors &&
						product.colors.map((color) => (
							<ColorSwatchPickerItem key={color.HEX} color={color.HEX} />
						))}
				</ColorSwatchPicker>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Количество:</Label>
				<div className="inline-flex items-center gap-2 border border-border rounded-lg w-fit">
					<button
						type="button"
						aria-label="Уменьшить количество"
						onClick={decrease}
						className="size-9 inline-flex items-center justify-center"
					>
						<Minus className="size-4" />
					</button>
					<span className="w-8 text-center text-sm font-medium" aria-live="polite">
						{quantity}
					</span>
					<button
						type="button"
						aria-label="Увеличить количество"
						onClick={increase}
						className="size-9 inline-flex items-center justify-center"
					>
						<Plus className="size-4" />
					</button>
				</div>
			</div>

			<div className="mt-auto">
				<div className="w-full flex flex-col gap-[10px] md:flex-row md:items-start">
					<Button variant="default" onClick={handleAddToCart}>
						Добавить в корзину
					</Button>
					<Button variant="outline">Избранное</Button>
				</div>

				<p className="w-full max-w-[335px] font-sans font-normal leading-[1.2] text-foreground mt-2">
					Примерная дата доставки:
					<br />
					17 окт. - 24 окт.
				</p>
			</div>
		</div>
	);
}
