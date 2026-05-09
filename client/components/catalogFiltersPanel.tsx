"use client";
import { type SubmitEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Field,
} from "@/components/ui/Field"
import { Button } from "@/components/ui/button";

import BrandField from "./filter/brandField";
import SizeField from "./filter/sizeField";
import ColorField from "./filter/colorField";
import PriceField, { MIN_PRICE, MAX_PRICE } from "./filter/priceField";

import type { Size, Brand, Color } from "@/entities/domain";

type CatalogFiltersPanelProps = {
	sizes: Size[];
	brands: Brand[];
	colors: Color[];
}

function parsePrice(raw: string | null, fallback: number): number {
	if (raw === null || raw === "") return fallback;
	const n = Number(raw);
	return Number.isFinite(n) ? n : fallback;
}

export function CatalogFiltersPanel({sizes, brands, colors}: CatalogFiltersPanelProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialBrands = searchParams.getAll("brands");
	const initialSizes = searchParams.getAll("sizes");
	const initialColor = searchParams.get("color") ?? undefined;
	const initialPriceFrom = parsePrice(searchParams.get("priceFrom"), MIN_PRICE);
	const initialPriceTo = parsePrice(searchParams.get("priceTo"), MAX_PRICE);

	const buildBaseParams = () => {
		const params = new URLSearchParams();
		const category = searchParams.get("category");
		if (category) params.set("category", category);
		const sub = searchParams.get("sub");
		if (sub) params.set("sub", sub);
		return params;
	};

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = buildBaseParams();

		for (const v of formData.getAll("brands")) {
			if (typeof v === "string" && v !== "") params.append("brands", v);
		}
		for (const v of formData.getAll("sizes")) {
			if (typeof v === "string" && v !== "") params.append("sizes", v);
		}

		const color = formData.get("color");
		if (typeof color === "string" && color !== "") params.set("color", color);

		const priceFrom = Number(formData.get("priceFrom") ?? MIN_PRICE);
		const priceTo = Number(formData.get("priceTo") ?? MAX_PRICE);
		if (Number.isFinite(priceFrom) && priceFrom > MIN_PRICE) {
			params.set("priceFrom", String(priceFrom));
		}
		if (Number.isFinite(priceTo) && priceTo < MAX_PRICE) {
			params.set("priceTo", String(priceTo));
		}

		const qs = params.toString();
		router.push(qs ? `/catalog?${qs}` : "/catalog");
	};

	const handleReset = () => {
		const params = buildBaseParams();
		const qs = params.toString();
		router.push(qs ? `/catalog?${qs}` : "/catalog");
	};

	return (
		<form onSubmit={handleSubmit} onReset={handleReset}>
			<FieldSet key={searchParams.toString()}>
				<FieldTitle className="text-2xl font-bold">Фильтры товаров</FieldTitle>
				<FieldGroup>
					<FieldLabel>Бренды:</FieldLabel>
					<FieldContent>
						<BrandField brands={brands} defaultValue={initialBrands} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Размеры:</FieldLabel>
					<FieldContent>
						<SizeField sizes={sizes} defaultValue={initialSizes} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Цвета:</FieldLabel>
					<FieldContent>
						<ColorField colors={colors} defaultValue={initialColor} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Цена:</FieldLabel>
					<FieldContent>
						<PriceField defaultFrom={initialPriceFrom} defaultTo={initialPriceTo} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<Field orientation="horizontal" className="pt-5">
					<Button type="submit" variant="default">Применить</Button>
					<Button type="reset" variant="outline">Сбросить</Button>
				</Field>
			</FieldSet>
		</form>
	);
}

export default CatalogFiltersPanel;
