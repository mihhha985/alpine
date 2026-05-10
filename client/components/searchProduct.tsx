"use client";
import { useState, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { SearchIcon } from "lucide-react";

interface searchProductProps {
	
}

function searchProduct(props: searchProductProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [searchValue, setSearchValue] = useState<string>(searchParams.get("q") ?? "");

	const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		const q = searchValue.trim();
		const params = new URLSearchParams();
		const category = searchParams.get("category");
		if (category) params.set("category", category);
		if (q !== "") params.set("q", q);
		const qs = params.toString();
		router.push(qs ? `/catalog?${qs}` : "/catalog");
	};

	return (
		<InputGroup className="max-w-md">
			<InputGroupInput
				placeholder="Search..."
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				onKeyDown={handleSearchKeyDown}
			/>
			<InputGroupAddon>
				<SearchIcon />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">
				<Kbd>Enter</Kbd>
			</InputGroupAddon>
		</InputGroup>	
	);
}

export default searchProduct;