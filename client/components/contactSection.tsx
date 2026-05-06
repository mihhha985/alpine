import Link from "next/link";
import { MessageSquare, Shirt, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

const INFO_BOXES = [
  {
    id: "order",
    icon: Shirt,
    title: "Как сделать заказ",
    description: "Подробная инструкция для новых клиентов",
    href: "#",
  },
  {
    id: "faq",
    icon: CircleHelp,
    title: "Вопросы и ответы",
    description: "Всё о доставке, возврате и пошлинах",
    href: "#",
  },
  {
    id: "help",
    icon: MessageSquare,
    title: "Нужна помощь?",
    description: "Обратитесь в нашу клиентскую службу",
    href: "#",
  },
];

const APP_DATA = {
  title: "Скачайте приложение Alpine",
  description:
    "Оцените эксклюзивный контент в нашем приложении, в том числе персональные рекомендации и виртуальную примерку для iOS.",
  formTitle: "почта",
  formDescription: "Мы отправим вам ссылку для скачивания приложения.",
  formHint: "Введите действительный адрес электронной почты.",
  cta: "Начать шопинг",
};

export function ContactSection() {
  return (
    <section className="section">
      <div className="section-layout flex flex-col gap-10 py-10 lg:gap-12 lg:py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {INFO_BOXES.map((box) => {
            const Icon = box.icon;
            return (
              <Link
                key={box.id}
                href={box.href}
                className="flex flex-col gap-[10px] rounded-md border border-foreground px-5 py-[10px]"
              >
                <Icon className="size-10" strokeWidth={1.5} />
                <p className="typo-contact-box-title font-sans font-medium uppercase">
                  {box.title}
                </p>
                <p className="typo-contact-box-description font-sans font-medium">{box.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-5">
            <h2 className="typo-contact-app-title font-sans font-medium uppercase">
              {APP_DATA.title}
            </h2>
            <p className="typo-contact-app-description font-sans font-medium">
              {APP_DATA.description}
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <p className="typo-contact-form-title font-sans font-medium uppercase">
              {APP_DATA.formTitle}
            </p>
            <p className="typo-contact-form-description font-sans font-medium">
              {APP_DATA.formDescription}
            </p>
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                className="h-[53px] w-full max-w-[382px] rounded-md border border-foreground bg-background px-4 font-sans typo-contact-input outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="typo-contact-form-hint font-sans font-medium">{APP_DATA.formHint}</p>
            </div>
            <Button variant="primary" type="submit" className="self-start">
              {APP_DATA.cta}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
