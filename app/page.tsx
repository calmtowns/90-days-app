"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function RootPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-beige-100 dark:bg-dark-200 flex items-center justify-center">
      <div className="text-brown-500 text-2xl font-bold animate-pulse-warm">90 Days</div>
    </div>
  );
}
