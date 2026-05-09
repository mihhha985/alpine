import type { Size } from "@/entities/domain";
import {Checkbox} from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/Field"

type SizeFieldProps = {
	sizes: Size[];
	defaultValue?: string[];
}

function SizeField({sizes, defaultValue = []}: SizeFieldProps) {
	const selected = new Set(defaultValue);

	return (
		<FieldGroup>
			{sizes.map((size) => {
				const id = `size-${size.Title}`;
				return (
					<Field key={size.Title} orientation="horizontal">
						<Checkbox
							id={id}
							name="sizes"
							value={size.Title}
							defaultChecked={selected.has(size.Title)}
						/>
						<FieldLabel htmlFor={id}>
							{size.Title}
						</FieldLabel>
					</Field>
				);
			})}
		</FieldGroup>
	);
}

export default SizeField;
