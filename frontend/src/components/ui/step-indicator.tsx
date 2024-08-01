import { cn } from "@/lib/utils";

function StepIndicator({ className, children }: { className?: string; children: number | string }) {
    return (
        <div
            className={cn(
                "inline-flex items-center justify-center bg-slate-900 w-[18px] h-[18px] rounded-full mr-2 font-bold text-white text-xs",
                className
            )}
        >
            {children}
        </div>
    );
}

export { StepIndicator };
