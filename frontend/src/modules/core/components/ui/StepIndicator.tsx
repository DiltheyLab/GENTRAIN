import { cn } from "@/core/helpers/cn";

export const StepIndicator = ({ className, children }: { className?: string; children: number | string }) => {
    return (
        <span
            className={cn(
                "flex justify-center bg-slate-900 w-[22px] h-[22px] rounded-full mr-2 font-bold text-white text-sm",
                className
            )}
        >
            {children}
        </span>
    );
};
