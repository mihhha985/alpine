import Link from "next/link";
import { Copyright } from "lucide-react";
import type { SortedCategory } from "@/entities/domain";

const FOOTER_COLUMNS = [
  {
    title: "Клиентам",
    links: [
      { label: "Помощь и контакты", href: "#" },
      { label: "Доставка и оплата", href: "#" },
      { label: "Возврат", href: "#" },
      { label: "Размерная сетка", href: "#" },
    ],
  },
  {
    title: "О компании",
    links: [
      { label: "О бренде", href: "#" },
      { label: "Магазины", href: "#" },
      { label: "Карьера", href: "#" },
      { label: "Пресс-центр", href: "#" },
    ],
  },
  {
    title: "Сервис",
    links: [
      { label: "Личный кабинет", href: "#" },
      { label: "Программа лояльности", href: "#" },
      { label: "Подарочные карты", href: "#" },
      { label: "Отследить заказ", href: "#" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Политика конфиденциальности", href: "#" },
  { label: "Условия пользования", href: "#" },
];

export function SiteFooter({ categories }: { categories: SortedCategory[] }) {
  return (
    <footer className="section bg-footer text-footer-foreground">
      <div className="section-layout flex flex-col gap-5 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-10 lg:justify-between">
          {categories.length > 0 ? (
            <div className="flex flex-col gap-[5px] md:w-[253px]">
              <h3 className="typo-footer-title font-sans font-semibold text-footer-foreground">
                Категории
              </h3>
              <ul className="flex flex-col gap-[5px]">
                {categories.map((category) => (
                  <li key={category.alias}>
                    <Link
                      href={`/catalog?category=${encodeURIComponent(category.alias)}`}
                      className="typo-footer-link font-sans font-medium text-footer-muted"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-[5px] md:w-[253px]">
              <h3 className="typo-footer-title font-sans font-semibold text-footer-foreground">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-[5px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="typo-footer-link font-sans font-medium text-footer-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-footer-muted/30" />

        <div className="flex flex-col gap-3 lg:gap-2 footer-text-size">
          <div className="flex flex-col gap-[5px] text-footer-foreground md:flex-row md:items-center md:gap-[100px]">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans font-medium underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-sans font-medium text-footer-muted">
            Название и логотип «ALPINE» являются торговыми марками Alpine и зарегистрированы в многочисленных юрисдикциях по всему миру.
          </p>
          <div className="flex items-center gap-[5px] text-footer-muted">
            <Copyright className="size-4" strokeWidth={1.5} />
            <p className="font-sans font-medium">
              Copyright 2026 Alpine. Все права защищены
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
