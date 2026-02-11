'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '🏠', href: '/dashboard' },
  { id: 'quests', label: 'Quests', icon: '📜', href: '/dashboard/quests' },
  { id: 'todos', label: 'Todos', icon: '✅', href: '/dashboard/todos' },
  { id: 'fitness-pal', label: 'Pal', icon: '💪', href: '/dashboard/fitness-pal' },
  { id: 'achievements', label: 'Awards', icon: '🏆', href: '/dashboard/achievements' },
  { id: 'profile', label: 'Profile', icon: '👤', href: '/dashboard/profile' },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-md border-t border-border-subtle z-50 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all relative ${
                active
                  ? 'text-accent-gold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
