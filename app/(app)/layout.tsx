import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-beige-50 dark:bg-dark-200">
      <main className="pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
