import type { Metadata } from "next";
import { CartSection } from "@/components/cartSection";

export const metadata: Metadata = {
	title: "Корзина — Alpine",
	description: "Товары, добавленные в корзину Alpine.",
};

export default function CartPage() {
	return <CartSection />;
}
