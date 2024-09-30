import { cn } from "@/modules/core/helpers/cn";

export const LoadingSpinner = ({
    className,
    width = 24,
    height = 24,
    strokeWidth = 2,
}: {
    className?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
};
