"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function DynamicHeader() {
  const pathname = usePathname();
  const open = useSidebarStore((state) => state.open);

  const getBreadcrumbs = (path: string) => {
    if (path === "/") return { section: "Platform", title: "Home" };
    if (path.startsWith("/account")) return { section: "Platform", title: "Account" };
    if (path.startsWith("/main-apps/saas-1")) return { section: "Main Apps", title: "SaaS 1" };
    if (path.startsWith("/main-apps/saas-2")) return { section: "Main Apps", title: "SaaS 2" };
    if (path.startsWith("/main-apps/saas-3")) return { section: "Main Apps", title: "SaaS 3" };
    if (path.startsWith("/blog")) return { section: "Explore", title: "The Blog" };
    if (path.startsWith("/terms")) return { section: "Explore", title: "Terms" };
    return { section: "Platform", title: "Home" };
  };

  const { section, title } = getBreadcrumbs(pathname);

  return (
    <header className="h-10 shrink-0 border-b border-black/10 flex items-center justify-between px-6 bg-(--sidebar) z-50 relative translate-z-0">
      <div className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
        {/* FORCED: Stone-900 ensures visibility on the stone background in both modes */}
        <span className="text-stone-900 opacity-50">{section}</span>
        <span className="text-stone-900 opacity-20">/</span>
        <span className="text-stone-900 font-black">
          {title}
        </span>
      </div>

      <div className="lg:hidden flex items-center">
        <button
          onClick={open}
          className="p-1 cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Open Menu"
        >
          {/* FORCED: Explicit text-black/stone-900 for the hamburger icon */}
          <Menu className="w-6 h-6 text-stone-900" />
        </button>
      </div>
    </header>
  );
}