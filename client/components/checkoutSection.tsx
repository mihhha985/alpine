"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";

const checkoutSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Имя должно содержать минимум 2 символа")
		.max(60, "Имя слишком длинное"),
	email: z
		.string()
		.trim()
		.min(1, "Укажите email")
		.email("Введите корректный email"),
	address: z
		.string()
		.trim()
		.min(10, "Адрес должен содержать минимум 10 символов")
		.max(200, "Адрес слишком длинный"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutSection() {
	const router = useRouter();
	const { state, totalQuantity, totalPrice, dispatch } = useCart();
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			name: "",
			email: "",
			address: "",
		},
		mode: "onBlur",
	});

	const { isSubmitting } = form.formState;

	if (state.items.length === 0 && !submitted) {
		return (
			<main className="min-h-[65vh] w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
				<section className="section-layout flex flex-col items-center gap-4 py-20">
					<h1 className="font-serif text-2xl">Корзина пуста</h1>
					<p className="text-muted-foreground">
						Сначала добавьте товары, чтобы оформить заказ.
					</p>
					<Link href="/catalog">
						<Button variant="default">Перейти в каталог</Button>
					</Link>
				</section>
			</main>
		);
	}

	if (submitted) {
		return (
			<main className="min-h-[65vh] w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
				<section className="section-layout flex flex-col items-center gap-4 py-20">
					<h1 className="font-serif text-2xl">Спасибо за заказ!</h1>
					<p className="text-muted-foreground">
						Мы отправили подтверждение на указанный email.
					</p>
					<Link href="/catalog">
						<Button variant="default">Вернуться в каталог</Button>
					</Link>
				</section>
			</main>
		);
	}

	const onSubmit = async (values: CheckoutFormValues) => {
		await new Promise((r) => setTimeout(r, 400));
		console.log("Order submitted:", { customer: values, items: state.items });
		dispatch({ type: "CLEAR" });
		setSubmitted(true);
		router.refresh();
	};

	return (
		<main className="w-full flex flex-col pt-[60px] md:pt-[90px] lg:pt-[100px]">
			<section className="section-layout flex flex-col gap-6 py-10 md:flex-row md:gap-10 justify-between">
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-1/3 flex flex-col gap-6"
					noValidate
				>
					<FieldSet>
						<FieldLegend>Оформление заказа</FieldLegend>
						<FieldDescription>
							Укажите данные получателя — мы свяжемся с вами для подтверждения.
						</FieldDescription>

						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Имя</FieldLabel>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder="Иван Иванов"
											autoComplete="name"
										/>
										<FieldDescription>
											Как к вам обращаться при доставке.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											{...field}
											id={field.name}
											type="email"
											aria-invalid={fieldState.invalid}
											placeholder="ivan@example.com"
											autoComplete="email"
											inputMode="email"
										/>
										<FieldDescription>
											На этот адрес придёт подтверждение заказа.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="address"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Адрес доставки</FieldLabel>
										<Textarea
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder="Город, улица, дом, квартира, индекс"
											autoComplete="street-address"
											rows={3}
										/>
										<FieldDescription>
											Город, улица, дом, квартира, индекс.
										</FieldDescription>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</FieldSet>

					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
						<Link href="/cart">
							<Button variant="outline" type="button">
								Вернуться в корзину
							</Button>
						</Link>
						<Button variant="default" type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Отправляем…" : "Подтвердить заказ"}
						</Button>
					</div>
				</form>

				<aside className="w-full md:w-[320px] flex flex-col gap-4 border border-border rounded-lg p-4 h-fit">
					<h2 className="font-serif text-xl">Ваш заказ</h2>
					<ul className="flex flex-col gap-2">
						{state.items.map((item) => (
							<li key={item.id} className="flex justify-between gap-3 text-sm">
								<span className="truncate">
									{item.brand?.Title ?? "Versachi"} — {item.Title}
									{item.size ? `, ${item.size.Title}` : ""} × {item.quantity}
								</span>
								<span className="shrink-0">{item.Price} ₽</span>
							</li>
						))}
					</ul>
					<div className="flex justify-between border-t border-border pt-3 text-sm">
						<span className="text-muted-foreground">Товаров</span>
						<span>{totalQuantity}</span>
					</div>
					<div className="flex justify-between text-lg">
						<span>Итого</span>
						<span>
							{new Intl.NumberFormat("ru-RU", {
								maximumFractionDigits: 0,
							}).format(totalPrice)}{" "}
							₽
						</span>
					</div>
				</aside>
			</section>
		</main>
	);
}
