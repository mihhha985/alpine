import type { Size } from "@/entities/domain";
import {Checkbox} from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/Field"

function SizeField({sizes}: {sizes: Size[]}) {
	return (
		<FieldGroup>
      {sizes.map((size) => 
				<Field key={size.Title} orientation="horizontal" data-invalid>
					<Checkbox
						id={size.Title}
						name="sizes"
					/>
					<FieldLabel htmlFor={size.Title}>
						{size.Title}
					</FieldLabel>
				</Field>
			)}
    </FieldGroup>
	);
}

export default SizeField;