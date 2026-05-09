"use client";
import { useState, useEffect } from "react";

export type ModalVisible = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function useModalVisible(): ModalVisible {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return { isOpen, setIsOpen };
}
