"use client";

import { useTheme } from "next-themes";
import { ArrowRight, Bot, Zap, Globe, BarChart3, Users, Sparkles, CheckCircle2, LayoutGrid, Command, Megaphone } from "lucide-react";
import { SafeComponent } from "@/components/SafeComponent";
import { Marquee } from "@/components/landing/Marquee";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const openMenu = useSidebarStore((state) => state.open);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const companies = [
    { name: "Black Forest Labs", icon: Sparkles },
    { name: "Google Deepmind", icon: Zap },
    { name: "OpenAI", icon: Globe },
    { name: "xAI", icon: Bot },
    { name: "Hugging Face", icon: BarChart3 },
    { name: "Vercel", icon: Users },
  ];

  return (
    <SafeComponent name="HomePage">
      <div className="flex flex-col min-h-screen">

        {/* HERO SECTION */}
        <section className="relative pt-8 pb-8 md:pt-20 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden justify-start md:justify-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-200/50 via-transparent to-transparent dark:from-stone-800/20" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[10px] mobile:text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-6 md:mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hyper Influencer Now Live
          </div>

          <h1 className="flex flex-col md:flex-row items-center justify-center gap-x-4 text-6xl md:text-8xl lg:text-9xl font-light tracking-[-0.07em] leading-[0.85] uppercase text-(--foreground) mb-4 md:mb-6">
            <span>VIRAL</span>
            <span>DIFFUSION</span>
          </h1>

          <p className="text-sm md:text-lg font-medium text-stone-600 dark:text-stone-400 mb-8 md:mb-10">
            Bleeding-Edge AI Content Automation Platform<br className="hidden md:block" />
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => router.push("/main-apps/saas-1")}
              className={cn(
                "group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 w-full md:w-auto",
                isDark
                  ? "bg-stone-50 text-stone-900 hover:bg-white"
                  : "bg-stone-900 text-stone-50 hover:bg-black"
              )}
            >
              Start Creating
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => router.push("/account")}
              className={cn(
                "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all border-2 w-full md:w-auto hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer",
                isDark
                  ? "border-white text-stone-300"
                  : "border-black text-stone-600"
              )}
            >
              Sign In
            </button>

            {/* MOBILE ONLY: OPEN MENU BUTTON */}
            <button
              onClick={openMenu}
              className={cn(
                "md:hidden inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all border-2 w-full active:scale-95",
                isDark
                  ? "border-white text-stone-400 hover:bg-stone-900"
                  : "border-black text-stone-500 hover:bg-stone-100"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Open Menu
            </button>
          </div>
        </section>

        {/* TRUSTED BY / MARQUEE */}
        <section className="pt-6 pb-6 md:py-12 border-y border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20">
          <div className="text-center mb-4 md:mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-600">
              Powered By
            </p>
          </div>
          <Marquee speed="slow" pauseOnHover>
            {companies.map((company, idx) => (
              <div key={idx} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity px-8 grayscale hover:grayscale-0">
                <company.icon className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-lg md:text-xl font-bold tracking-tight text-stone-800 dark:text-stone-200">
                  {company.name}
                </span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* FEATURE GRID */}
        <section className="pt-8 pb-12 md:py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">

            {/* PRIMARY FEATURE */}
            <div className="md:col-span-2 row-span-2 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
              <div className="z-10">
                <div className="w-12 h-12 rounded-xl bg-stone-900 dark:bg-stone-50 flex items-center justify-center mb-6 text-stone-50 dark:text-stone-900">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
                  Hyper Influencer
                </h3>
                <p className="text-lg text-stone-600 dark:text-stone-400 max-w-lg">
                  Generate hyper-realistic AI influencers with consistent faces and unique outputs.
                  Photorealistic results without models or studios, just pure, improved creativity.
                </p>
              </div>
              <div className="mt-8 z-10">
                <ul className="space-y-3">
                  {["Consistent Faces", "Photorealistic Output", "Unique Results"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-stone-500 dark:text-stone-500 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SECONDARY FEATURE 1 - CREATOR PROMPTS */}
            <div className="rounded-3xl bg-white dark:bg-black border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-center gap-4 hover:border-stone-400 dark:hover:border-stone-600 transition-colors group">
              <Command className="w-8 h-8 text-stone-400 group-hover:text-amber-500 transition-colors" />
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-50">Creator Prompts</h4>
              <p className="text-sm text-stone-500">
                Use customized creator prompts for unique outputs. Every avatar generation is distinct and tailored to you.
              </p>
            </div>

            {/* SECONDARY FEATURE 2 - BRANDING PROMPTS */}
            <div className="rounded-3xl bg-white dark:bg-black border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-center gap-4 hover:border-stone-400 dark:hover:border-stone-600 transition-colors group">
              <Megaphone className="w-8 h-8 text-stone-400 group-hover:text-blue-500 transition-colors" />
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-50">Branding Prompts</h4>
              <p className="text-sm text-stone-500">
                Create product and service ads with your influencers. Test many unique pre-built prompts for diverse results.
              </p>
            </div>
          </div>
        </section>

      </div>
    </SafeComponent>
  );
}