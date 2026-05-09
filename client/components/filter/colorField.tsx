"use client";
import { useState } from "react";
import type { Color } from "@/entities/domain";
import {ColorSwatchPicker, ColorSwatchPickerItem} from '@/components/ui/colorSwatchPicker';

type ColorFieldProps = {
	colors: Color[];
	defaultValue?: string;
}

function ColorField({colors, defaultValue}: ColorFieldProps) {
	const [selected, setSelected] = useState<string | undefined>(defaultValue);

	return (
		<>
			<ColorSwatchPicker
				className="flex flex-wrap items-center gap-2"
				value={selected}
				onChange={(color) => setSelected(color.toString('hex'))}
			>
				{colors.map((color) => (
					<ColorSwatchPickerItem key={color.HEX} color={color.HEX} />
				))}
			</ColorSwatchPicker>
			{selected !== undefined && (
				<input type="hidden" name="color" value={selected} />
			)}
		</>
	);
}

export default ColorField;
