import type { Metadata } from "next";
import { CheckoutSection } from "@/components/checkoutSection";

export const metadata: Metadata = {
	title: "Оформление заказа — Alpine",
	description: "Завершите покупку: данные получателя и адрес доставки.",
};

export default function CheckoutPage() {
	return <CheckoutSection />;
}
