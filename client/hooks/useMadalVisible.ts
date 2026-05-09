"use client";
import { useState, useEffect } from "react";

export type ModalVisible = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function useMadalVisible(): ModalVisible {
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

	return { isOpen: isMenuOpen, setIsOpen: setIsMenuOpen };
}