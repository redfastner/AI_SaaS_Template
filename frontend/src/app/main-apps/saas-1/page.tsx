import { SafeComponent } from "@/components/SafeComponent";

export default function SaaS1Page() {
    return (
        <SafeComponent name="SaaS1Page">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-stone-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    1
                </div>
                <h1 className="text-3xl font-bold uppercase tracking-tight">SaaS Product 1</h1>
                <p className="text-stone-500 max-w-md">
                    This is a blank canvas for your first SaaS application.
                    The backend endpoint is ready at <code>/api/v1/saas-1</code>.
                </p>
                <div className="p-4 bg-stone-100 dark:bg-zinc-900 rounded-lg font-mono text-xs border border-stone-200 dark:border-zinc-800">
                    frontend/src/app/main-apps/saas-1/page.tsx
                </div>
            </div>
        </SafeComponent>
    );
}
