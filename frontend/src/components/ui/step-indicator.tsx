import { cn } from "@/lib/utils";

export const StepIndicator = ({ className, children }: { className?: string; children: number | string }) => {
    return (
        <span
            className={cn(
                "flex items-center justify-center bg-slate-900 w-[20px] h-[20px] rounded-full mr-2 font-bold text-white text-xs",
                className
            )}
        >
            {children}
        </span>
    );
};
