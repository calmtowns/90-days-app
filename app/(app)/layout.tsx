import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ambient-bg">
      {children}
      <BottomNav />
    </div>
  );
}
