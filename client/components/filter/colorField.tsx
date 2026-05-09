import type { Color } from "@/entities/domain";
import {ColorSwatchPicker, ColorSwatchPickerItem} from '@/components/ui/colorSwatchPicker';

function ColorField({colors}: {colors: Color[]}) {
	return (
		<ColorSwatchPicker className="flex flex-wrap items-center gap-2">
			{colors.map((color) => (
				<ColorSwatchPickerItem key={color.HEX} color={color.HEX} />
			))}
		</ColorSwatchPicker>
	);
}

export default ColorField;