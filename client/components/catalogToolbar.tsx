"use client";
import { useState } from "react";
import Link from "next/link";
import { SearchIcon, ChevronsLeft } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Field,
} from "@/components/ui/Field"
import {Button} from "@/components/ui/button";

import { useMadalVisible } from "@/hooks/useMadalVisible";
import ModalContainer from "./modalContainer";
import BrandField from "./filter/brandField";
import SizeField from "./filter/sizeField";
import ColorField from "./filter/colorField";
import PriceField from "./filter/priceField";

import type { 
	SortedCategory, 
	SubCategory,
	Size,
	Brand,
	Color,
} from "@/entities/domain";

type ToolbarProps = {
	activeCategory: string | undefined;
	activeSubCategory: string | undefined;
	categories: SortedCategory[];
	subCategories: SubCategory[];
	sizes: Size[];
	brands: Brand[];
	colors: Color[];
}

export function CatalogToolbarSection(
	{activeCategory, activeSubCategory, categories, subCategories, sizes, brands, colors}: ToolbarProps
) {
  const { isOpen, setIsOpen } = useMadalVisible();

  return (
		<>
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

					<Button
						onClick={() => setIsOpen(true)} 
						size={"lg"}>
						<ChevronsLeft />
						Фильтр
					</Button>
				</div>
      </div>
    </section>
		<ModalContainer 
			variant="right" 
			isOpen={isOpen} 
			close={() => setIsOpen(false)}>
			<FieldSet>
				<FieldTitle className="text-2xl font-bold">Фильтры товаров</FieldTitle>
				<FieldGroup>
					<FieldLabel>Бренды:</FieldLabel>
					<FieldContent>
						<BrandField brands={brands} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Размеры:</FieldLabel>
					<FieldContent>
						<SizeField sizes={sizes} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Цвета:</FieldLabel>
					<FieldContent>
						<ColorField colors={colors} />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<FieldGroup>
					<FieldLabel>Цена:</FieldLabel>
					<FieldContent>
						<PriceField />
					</FieldContent>
				</FieldGroup>
				<FieldSeparator />
				<Field orientation="horizontal" className="pt-5">
					<Button variant="default">Применить</Button>
					<Button variant="outline">Сбросить</Button>
				</Field>
			</FieldSet>
		</ModalContainer>
	</>
  );
}
