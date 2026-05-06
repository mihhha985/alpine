import Link from "next/link";

export default function AppNotFound() {
  return (
    <main className="w-full h-[80vh] flex flex-col items-center gap-6 px-5 py-[120px] md:px-10 md:py-[160px]">
      <h1 className="font-serif text-4xl font-medium text-foreground">Страница не найдена</h1>
      <p className="typo-not-found-description font-sans text-card-foreground">
        Проверьте адрес страницы или вернитесь в каталог.
      </p>
      <Link
        href="/catalog"
        className="w-full h-[69px] max-w-[320px] flex items-center justify-center rounded-[8px] bg-secondary px-5 py-5"
      >
        <span className="typo-not-found-cta font-sans font-semibold text-background">Перейти в каталог</span>
      </Link>
    </main>
  );
}
