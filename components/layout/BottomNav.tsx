"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, CheckSquare, BarChart2, Calendar, BookOpen } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/analytics", icon: BarChart2, label: "Stats" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/notes", icon: BookOpen, label: "Notes" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass dark:glass-dark border-t border-beige-200/50 dark:border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl min-w-[56px] relative"
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-brown-500/10 dark:bg-brown-400/15 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`transition-colors ${active ? "text-brown-500 dark:text-brown-300" : "text-brown-400/50 dark:text-beige-400/40"}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${active ? "text-brown-500 dark:text-brown-300" : "text-brown-400/50 dark:text-beige-400/40"}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
