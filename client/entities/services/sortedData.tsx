import { cache } from "react";
import { fetchCategories } from "../repository/fetchCategories";
import type { SortedCategory } from "../domain";

export const sortedData = cache(async (): Promise<SortedCategory[]> => {
	const data = await fetchCategories();
	return data.categories.map((category) => ({
		title: category.Title,
		alias: category.Alias,
	}));
});