"use client";
import { useState, type ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import { Field } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"

export const MIN_PRICE = 0;
export const MAX_PRICE = 100000;
const PRICE_STEP = 1000;

const clampPrice = (n: number) => Math.min(Math.max(n, MIN_PRICE), MAX_PRICE);

type PriceFieldProps = {
	defaultFrom?: number;
	defaultTo?: number;
}

function PriceField({defaultFrom = MIN_PRICE, defaultTo = MAX_PRICE}: PriceFieldProps) {
	const [from, setFrom] = useState<number>(clampPrice(defaultFrom));
	const [to, setTo] = useState<number>(clampPrice(defaultTo));

	const handleFromInput = (e: ChangeEvent<HTMLInputElement>) => {
		const raw = Number(e.target.value);
		const next = Number.isFinite(raw) ? clampPrice(raw) : MIN_PRICE;
		setFrom(Math.min(next, to));
	};

	const handleToInput = (e: ChangeEvent<HTMLInputElement>) => {
		const raw = Number(e.target.value);
		const next = Number.isFinite(raw) ? clampPrice(raw) : MAX_PRICE;
		setTo(Math.max(next, from));
	};

	const handleSlider = ([nextFrom, nextTo]: number[]) => {
		setFrom(nextFrom);
		setTo(nextTo);
	};

	const formattedMax = MAX_PRICE.toLocaleString("ru-RU");

	return (
		<Field orientation="vertical" className="flex flex-col gap-10">
			<div className="flex items-center justify-between">
				<InputGroup className="w-40">
					<InputGroupInput
						type="number"
						name="priceFrom"
						min={MIN_PRICE}
						max={MAX_PRICE}
						value={from}
						onChange={handleFromInput}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>₽</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup className="w-40">
					<InputGroupInput
						type="number"
						name="priceTo"
						min={MIN_PRICE}
						max={MAX_PRICE}
						value={to}
						onChange={handleToInput}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>₽</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</div>
			<div className="flex flex-col gap-2">
				<Slider
					value={[from, to]}
					onValueChange={handleSlider}
					min={MIN_PRICE}
					max={MAX_PRICE}
					step={PRICE_STEP}
				/>
				<div className="flex items-center justify-between text-muted-foreground">
					<span>{MIN_PRICE} ₽</span>
					<span>{formattedMax} ₽</span>
				</div>
			</div>
		</Field>
	);
}

export default PriceField;
