"use client";
import Link from "next/link";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/logo";
import ModalContainer from "./modalContainer";
import { useMadalVisible } from "@/hooks/useMadalVisible";
import type { SortedCategory } from "@/entities/domain";

export function SiteHeader({ categories }: { categories: SortedCategory[] }) {
  
  const { isOpen, setIsOpen } = useMadalVisible();

  return (
    <>
      <header className={`fixed top-0 left-0 z-20 flex h-[40px] w-full items-center md:h-[80px]
      ${isOpen ? "" : "backdrop-blur-xl"}`}>
      <div className="section-layout flex w-full items-center justify-between">
        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={isOpen}
          aria-controls="site-header-menu"
          className="inline-flex items-center justify-center text-foreground"
          onClick={() => setIsOpen(true)}
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
			<ModalContainer 
				variant="left"
				isOpen={isOpen} 
				close={() => setIsOpen(false)}>
				<nav className="w-full flex flex-col gap-4" aria-label="Разделы сайта">
					<Link
						href="/"
						className="w-full px-3 py-2 font-sans font-medium text-foreground hover:bg-muted"
						onClick={() => setIsOpen(false)}
					>
						Главная
					</Link>
					{categories.map((category) => (
						<Link
							key={category.alias}
							href={`/catalog?category=${encodeURIComponent(category.alias)}`}
							className="w-full px-3 py-2 font-sans font-medium text-foreground hover:bg-muted capitalize"
							onClick={() => setIsOpen(false)}
						>
							{category.title}
						</Link>
					))}
				</nav>
			</ModalContainer>
    </>
  );
}
