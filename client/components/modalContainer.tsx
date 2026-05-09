import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
interface modalContainerProps {
	variant: "left" | "right";
	isOpen: boolean;
	close: ()=>void;
	children: React.ReactNode;
}

function ModalContainer({variant, isOpen, close, children}: modalContainerProps) {
		return (
			<AnimatePresence>
				{isOpen ? (
					<div 
						onClick={close}
						className="h-full fixed inset-0 z-30 flex items-start bg-black/10 backdrop-blur-xs">
						<Button
								type="button"
								variant="ghost"
								aria-label="Закрыть меню"
								className={`absolute top-5 ${variant === "left" ? "right-5" : "left-5"}`}
								onClick={close}
							>
								<X className="size-8" strokeWidth={1.5} />
						</Button>
						<motion.aside
							onClick={e => e.stopPropagation()}
							initial={{x: variant === "left" ? "-100%" : "100%"}}
							animate={{x: 0}}
							exit={{x: variant === "left" ? "-100%" : "100%"}}
							transition={{duration:.6, type: "spring"}}
							id="site-header-menu"
							aria-label="Навигация по сайту"
							className={`
								w-[90vw] h-screen flex flex-col gap-8 px-5 py-6 bg-background md:w-[50vw] md:px-8 md:py-8 lg:w-[30vw]
								absolute top-0 ${variant === "left" ? "left-0" : "right-0"}
								`}
						>
							{children}
						</motion.aside>
					</div>
				) : null}
			</AnimatePresence>
		);
}

export default ModalContainer;