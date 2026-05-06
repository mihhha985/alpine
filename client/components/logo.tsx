import Link from "next/link";

export function Logo() {

  return (
    <Link
      href="/"
      aria-label="ALPINE — на главную"
      className={`font-display text-foreground text-3xl`}
    >
      ALPINE
    </Link>
  );
}
