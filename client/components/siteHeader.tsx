"use client";
import Link from "next/link";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/logo";
import ModalContainer from "./modalContainer";
import { FavoritesSheet } from "@/components/favoritesSheet";
import { useModalVisible } from "@/hooks/useModalVisible";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import type { SortedCategory } from "@/entities/domain";

export function SiteHeader({ categories }: { categories: SortedCategory[] }) {
  const { isOpen, setIsOpen } = useModalVisible();
	const { totalQuantity } = useCart();
	const {
		open: openFavorites,
		totalQuantity: favoritesQuantity,
		isOpen: isFavoritesOpen,
	} = useFavorites();

  return (
    <>
      <header className={`fixed top-0 left-0 z-20 flex h-[40px] w-full items-center md:h-[80px]
      ${isOpen || isFavoritesOpen ? "" : "backdrop-blur-xl"}`}>
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
          <button
            type="button"
            aria-label="Избранное"
            aria-expanded={isFavoritesOpen}
            onClick={openFavorites}
            className="inline-flex items-center relative"
          >
            <Heart className="menu-icon-size" strokeWidth={1.5} />
						{favoritesQuantity > 0 && (
							<div className="cart-icon-count">
								<span>{favoritesQuantity}</span>
							</div>
						)}
          </button>
          <Link href="/cart" aria-label="Корзина" className="inline-flex items-center relative">
            <ShoppingCart className="menu-icon-size" strokeWidth={1.5} />
						{totalQuantity > 0 && (
							<div className="cart-icon-count">
								<span className="relative left-px top-px">{totalQuantity}</span>
							</div>
						)}
          </Link>
        </nav>
      </div>
      </header>
			<ModalContainer 
				variant="left"
				isOpen={isOpen} 
				close={() => setIsOpen(false)}
				id="site-header-menu"
				ariaLabel="Навигация по сайту">
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
			<FavoritesSheet />
    </>
  );
}
