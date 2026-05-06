"use client";

import Link from "next/link";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <main className="w-full flex flex-col items-center gap-4 px-5 py-[120px] md:px-10 md:py-[160px]">
      <h1 className="font-serif text-4xl font-medium text-foreground">Что-то пошло не так</h1>
      <p className="typo-not-found-description max-w-[520px] text-center font-sans text-card-foreground">
        Не удалось загрузить данные. Попробуйте еще раз.
      </p>
      <p className="typo-not-found-description max-w-[520px] text-center font-sans text-card-foreground">
        {error.message}
      </p>
      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <button
          type="button"
          onClick={reset}
          className="w-full h-[69px] flex items-center justify-center rounded-[8px] bg-secondary px-5 py-5 font-sans font-semibold text-background"
        >
          Повторить
        </button>
        <Link
          href="/catalog"
          className="w-full h-[69px] flex items-center justify-center rounded-[8px] border border-foreground px-5 py-5"
        >
          <span className="typo-not-found-cta font-sans font-semibold text-foreground">Перейти в каталог</span>
        </Link>
      </div>
    </main>
  );
}
