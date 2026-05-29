"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV = [
  { href: '/home', icon: '⬡', label: 'Home' },
  { href: '/track', icon: '◎', label: 'Track' },
  { href: '/calendar', icon: '◫', label: 'Calendar' },
  { href: '/notes', icon: '◈', label: 'Notes' },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom">
      <div className="mx-4 mb-3 rounded-3xl px-6 py-3 flex justify-around items-center"
        style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 -1px 30px rgba(0,0,0,0.5)' }}>
        {NAV.map(item => {
          const active = path === item.href || path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 relative px-3 py-1">
              {active && (
                <motion.div layoutId="nav-blob" className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
              )}
              <span className={`text-xl relative z-10 transition-all ${active ? 'scale-110' : 'scale-100 opacity-40'}`}>{item.icon}</span>
              <span className={`text-[10px] font-medium relative z-10 transition-colors ${active ? 'text-violet-400' : 'text-white/30'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
