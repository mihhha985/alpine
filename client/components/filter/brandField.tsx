import { useState, useMemo } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import type { Brand } from "@/entities/domain";
function BrandField({brands}: {brands: Brand[]}) {
	const anchor = useComboboxAnchor()
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const brandsList = useMemo<string[]>(() => {
		return brands.map((brand) => brand.Title);
	}, [brands]);

	return (
		<Combobox
			multiple
			autoHighlight
			items={brandsList}
			value={selectedBrands}
			onValueChange={setSelectedBrands}
		>
			<ComboboxChips ref={anchor} className="w-full">
				<ComboboxValue>
					{selectedBrands.map((item) => (
						<ComboboxChip key={item}>{item}</ComboboxChip>
					))}
				</ComboboxValue>
				<ComboboxChipsInput placeholder={selectedBrands.length > 0 ? "" : "Выберите бренды"} />
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>Нет брендов.</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}

export default BrandField;