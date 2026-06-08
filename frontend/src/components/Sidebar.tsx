"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, FileText, Sun, Moon, User, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useUserStore } from "@/store/useUserStore";

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const closeMenu = useSidebarStore((state) => state.close);
  const { user, isLoading, credits } = useUserStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 bg-(--sidebar) text-stone-800 h-full flex flex-col shrink-0 border-r border-black">
      {/* Brand Header */}
      <div className="py-8 flex items-center justify-center border-b border-black gap-3 px-4">
        {/* LOGO BOX: Sized at w-12/h-12 (48px) to match your 'big' preference */}
        <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg border border-black/10 shadow-sm bg-stone-200">
          <Image
            src="/vd-logo.svg"
            alt="Optimize Maximal AI Logo"
            fill
            sizes="48px"
            /* unoptimized stops desktop blur; object-contain makes it fill the box */
            unoptimized
            className="object-contain p-0.5"
            priority
          />
        </div>
        <div className="text-sm font-bold tracking-tighter uppercase text-stone-900 leading-none flex flex-col justify-center">
          <span>Optimize Maximal</span>
          <span>AI</span>
        </div>
      </div>

      <nav className="px-3 pt-6 flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 ml-3 font-bold">Platform</div>
        <Link
          href="/"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === '/' ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          href="/account"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === '/account' ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <User className="w-4 h-4" /> Account
        </Link>

        <div className="my-4 border-t border-black" />

        <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 ml-3 font-bold">Main Apps</div>
        <Link
          href="/main-apps/saas-1"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.includes('/main-apps/saas-1') ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <Wand2 className="w-4 h-4" /> SaaS 1
        </Link>
        <Link
          href="/main-apps/saas-2"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.includes('/main-apps/saas-2') ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <Wand2 className="w-4 h-4" /> SaaS 2
        </Link>
        <Link
          href="/main-apps/saas-3"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.includes('/main-apps/saas-3') ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <Wand2 className="w-4 h-4" /> SaaS 3
        </Link>

        <div className="mt-4 mb-4 border-t border-black" />

        <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2 ml-3 font-bold">Explore</div>

        <Link
          href="/blog"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.includes('/blog') ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <Compass className="w-4 h-4" /> The Blog
        </Link>

        <Link
          href="/terms"
          onClick={closeMenu}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname.includes('/terms') ? 'bg-stone-800 text-stone-50 shadow-sm' : 'hover:bg-stone-400/20'
            }`}
        >
          <FileText className="w-4 h-4" /> Terms
        </Link>
      </nav>

      {/* Footer / User Session */}
      <div className="mt-auto p-4 border-t border-black space-y-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-400/20 hover:bg-stone-400/40 transition-all cursor-pointer"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Theme</span>
          {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
        </button>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-stone-400/10 border border-black min-h-11.5">
          {isLoading ? (
            <div className="w-full flex items-center gap-2 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-stone-400/30" />
              <div className="h-2 w-16 bg-stone-400/30 rounded" />
            </div>
          ) : (
            <>
              {user?.user_metadata?.avatar_url ? (
                <div className="relative w-6 h-6">
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center text-[10px] text-white font-bold">
                  {user?.email?.[0].toUpperCase() || 'G'}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900">
                  {user ? (user.user_metadata?.full_name || user.email?.split('@')[0]) : 'Guest'}
                </span>
                {user && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900 mt-0.5">
                    {credits} Credits
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;