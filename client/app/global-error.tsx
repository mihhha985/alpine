"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body>
        <main className="w-full h-screen flex flex-col items-center justify-center gap-4 px-5">
          <h1 className="font-serif text-4xl font-medium text-foreground">Критическая ошибка</h1>
          <p className="typo-not-found-description max-w-[520px] text-center font-sans text-card-foreground">
            Не удалось отобразить приложение. Попробуйте перезагрузить страницу.
          </p>
          <p className="typo-not-found-description max-w-[520px] text-center font-sans text-card-foreground">
            {error.message}
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-full h-[69px] max-w-[320px] flex items-center justify-center rounded-[8px] bg-secondary px-5 py-5 font-sans font-semibold text-background"
          >
            Повторить
          </button>
        </main>
      </body>
    </html>
  );
}
