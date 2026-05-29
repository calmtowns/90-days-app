"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function RootPage() {
  const { user } = useAppStore();
  const router = useRouter();
  useEffect(() => {
    router.replace(user.onboardingCompleted ? '/home' : '/onboarding');
  }, []);
  return null;
}
