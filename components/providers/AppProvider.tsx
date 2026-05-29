"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAppStore();

  useEffect(() => {
    // Always keep dark mode on for this redesign
    document.documentElement.classList.add("dark");
  }, [darkMode]);

  return <>{children}</>;
}
