// frontend/src/app/LayoutClient.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { X } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import DynamicHeader from "@/components/DynamicHeader";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);

  return (
    <ThemeProvider>
      <div className="flex h-[100dvh] w-full bg-(--background) text-(--foreground) transition-colors duration-300 overflow-hidden">

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={close}
            />
            <div className="absolute inset-y-0 left-0 w-64 bg-(--sidebar) border-r border-(--border-color) shadow-2xl transition-transform duration-300">
              <Sidebar />
              <button
                className="absolute top-4 -right-12 p-2 bg-black text-white rounded-full border border-white/20 cursor-pointer"
                onClick={close}
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <DynamicHeader />

          <main className="flex-1 overflow-y-auto">
            <div className={
              pathname.includes('/main-apps') || pathname === '/account'
                ? "h-full w-full"
                : "p-4 md:p-12 max-w-5xl mx-auto"
            }>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}