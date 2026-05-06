import Image from "next/image";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_DATA = {
  title: "Осенняя палитра цветов",
  description:
    "Богатая зелень, насыщенный красный, темно-коричневый и все оттенки земли — естественный выбор для осени. Thom Browne, Prada, Ferragamo и другие бренды.",
  cta: "Начать шопинг",
  badge: "оригинальное качество",
  image: "/heroModel.png",
  imageAlt: "Осенняя коллекция Alpine",
};

export function HeroSection() {
  return (
    <section className="section bg-card pt-[40px] md:pt-[80px]">
      <div className="section-layout flex flex-col">
        <div className="flex flex-col-reverse items-stretch gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex flex-col gap-10 md:max-w-[478px] md:gap-16 lg:gap-24">
            <div className="flex flex-col gap-6 md:gap-10">
              <h1 className="typo-hero-title font-serif font-medium">
                {HERO_DATA.title}
              </h1>
              <p className="typo-hero-description font-serif">
                {HERO_DATA.description}
              </p>
            </div>
            <Button variant="outline" className="self-start">
              {HERO_DATA.cta}
            </Button>
          </div>

          <div className="relative aspect-517/702 w-full overflow-hidden md:w-[517px] md:shrink-0">
            <Image
              src={HERO_DATA.image}
              alt={HERO_DATA.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 517px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-[5px]">
            <CheckCheck className="size-6" strokeWidth={1.5} />
            <p className="typo-hero-badge font-sans font-semibold">
              {HERO_DATA.badge}
            </p>
          </div>
          <div className="flex items-center gap-[51px]">
            <span className="typo-hero-counter font-sans font-light">01</span>
            <span aria-hidden className="h-px w-[100px] bg-foreground" />
            <span className="typo-hero-counter font-sans font-light text-muted-foreground">
              02
            </span>
            <span aria-hidden className="h-px w-[100px] bg-foreground/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
