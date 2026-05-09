"use client";
import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import type { Brand } from "@/entities/domain";

type BrandFieldProps = {
	brands: Brand[];
	defaultValue?: string[];
}

function BrandField({brands, defaultValue = []}: BrandFieldProps) {
	const anchor = useComboboxAnchor();
	const [selected, setSelected] = useState<string[]>(defaultValue);

	const slugs = useMemo<string[]>(() => brands.map((b) => b.Slug), [brands]);
	const slugToTitle = useMemo(() => {
		const map = new Map<string, string>();
		brands.forEach((b) => map.set(b.Slug, b.Title));
		return map;
	}, [brands]);

	return (
		<>
			<Combobox
				multiple
				autoHighlight
				items={slugs}
				value={selected}
				onValueChange={setSelected}
			>
				<ComboboxChips ref={anchor} className="w-full">
					<ComboboxValue>
						{selected.map((slug) => (
							<ComboboxChip key={slug}>{slugToTitle.get(slug) ?? slug}</ComboboxChip>
						))}
					</ComboboxValue>
					<ComboboxChipsInput placeholder={selected.length > 0 ? "" : "Выберите бренды"} />
				</ComboboxChips>
				<ComboboxContent anchor={anchor}>
					<ComboboxEmpty>Нет брендов.</ComboboxEmpty>
					<ComboboxList>
						{(slug) => (
							<ComboboxItem key={slug} value={slug}>
								{slugToTitle.get(slug) ?? slug}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			{selected.map((slug) => (
				<input key={slug} type="hidden" name="brands" value={slug} />
			))}
		</>
	);
}

export default BrandField;
