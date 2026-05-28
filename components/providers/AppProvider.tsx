"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, updateCharacterState } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    updateCharacterState();
    const interval = setInterval(updateCharacterState, 60000);
    return () => clearInterval(interval);
  }, [updateCharacterState]);

  return <>{children}</>;
}
