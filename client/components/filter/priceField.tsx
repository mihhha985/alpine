"use client"
import { Slider } from "@/components/ui/slider";
import { Field } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"

function PriceField() {
	return (
		<Field orientation="vertical" data-invalid className="flex flex-col gap-10">
			<div className="flex items-center justify-between">
				<InputGroup className="w-40">
					<InputGroupInput placeholder="0" />
					<InputGroupAddon align="inline-end">
						<InputGroupText>₽</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				<InputGroup className="w-40">
					<InputGroupInput placeholder="100 000" />
					<InputGroupAddon align="inline-end">
						<InputGroupText>₽</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</div>
			<Slider
				defaultValue={[25, 50]}
				max={100}
				step={5}
			/>
		</Field>
	);
}

export default PriceField;