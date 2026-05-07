"use client";
import Link from "next/link";
import { SearchIcon, ChevronsLeft } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {Button} from "@/components/ui/button";
import type { SortedCategory, SubCategory } from "@/entities/domain";

type ToolbarProps = {
	activeCategory: string | undefined;
	activeSubCategory: string | undefined;
	categories: SortedCategory[];
	subCategories: SubCategory[];
}

export function CatalogToolbarSection({activeCategory, activeSubCategory, categories, subCategories}: ToolbarProps) {
  return (
    <section className="section py-10">
      <div className="section-layout flex flex-col gap-5">

				<div className="w-full flex items-center justify-between">

					<div className="flex w-full flex-wrap items-center gap-[35px] md:w-auto">
						{categories.map((category) => (
							<Link 
								key={category.alias}
								href={`/catalog?category=${category.alias}`}
								className={`${category.alias === activeCategory ? "text-foreground" : "text-muted-foreground"} 
								uppercase hover:underline transition-all duration-300`}>
									{category.title}
								</Link>
						))}
					</div>

					<InputGroup className="max-w-md">
						<InputGroupInput placeholder="Search..." />
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
					</InputGroup>	

				</div>

				<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-2">
						{subCategories.map((category) => (
							<Link 
								key={category.UID}
								href={`/catalog?category=${activeCategory}&sub=${category.UID}`}
								className={`border border-foreground rounded-full px-4 py-2 transition-all duration-300
								${category.UID === activeSubCategory ? "bg-foreground text-background" : "text-foreground bg-transparent hover:bg-muted"}`}>
								{category.Title}
							</Link>
						))}
					</div>

					<Button size={"lg"}>
						<ChevronsLeft />
						Фильтр
					</Button>
				</div>
      </div>
    </section>
  );
}
