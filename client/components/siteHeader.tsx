"use client";

import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { Logo } from "@/components/logo";
import type { SortedCategory } from "@/entities/domain";

export function SiteHeader({ categories }: { categories: SortedCategory[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 z-20 flex h-[40px] w-full items-center md:h-[80px]
      ${isMenuOpen ? "" : "backdrop-blur-xl"}`}>
      <div className="section-layout flex w-full items-center justify-between">
        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={isMenuOpen}
          aria-controls="site-header-menu"
          className="inline-flex items-center justify-center text-foreground"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="menu-icon-size" strokeWidth={1.5} />
        </button>

        <Logo />

        <nav className="flex items-center gap-4 md:gap-8 lg:gap-10" aria-label="Пользовательские действия">
          <Link
            href="/favorites"
            aria-label="Избранное"
            className="relative hidden items-center md:inline-flex"
          >
            <Heart className="menu-icon-size" strokeWidth={1.5} />
            <span className="absolute -right-0.5 bottom-0 inline-flex size-[16px] items-center justify-center rounded-full bg-foreground font-sans font-medium text-background lg:size-[18px]">
              1
            </span>
          </Link>
          <Link href="/cart" aria-label="Корзина" className="inline-flex items-center">
            <ShoppingCart className="menu-icon-size" strokeWidth={1.5} />
          </Link>
        </nav>
      </div>
      </header>
      {isMenuOpen ? (
        <div className="h-full fixed inset-0 z-30 flex items-start bg-black/10 backdrop-blur-xs">
          <aside
            id="site-header-menu"
            aria-label="Навигация по сайту"
            className="w-[90vw] h-screen flex flex-col gap-8 relative px-5 py-6 bg-background md:w-[50vw] md:px-8 md:py-8 lg:w-[30vw]"
          >
            <button
              type="button"
              aria-label="Закрыть меню"
              className="inline-flex w-fit h-[40px] items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="size-8" strokeWidth={1.5} />
            </button>
            <nav className="w-full flex flex-col gap-4" aria-label="Разделы сайта">
              <Link
                href="/"
                className="w-full px-3 py-2 font-sans font-medium text-foreground hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.alias}
                  href={`/catalog?category=${encodeURIComponent(category.alias)}`}
                  className="w-full px-3 py-2 font-sans font-medium text-foreground hover:bg-muted capitalize"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.title}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
