import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const genRandomTree = (N = 9000, reverse = false) => {
    return {
        nodes: [...Array(N).keys()].map((i) => ({ id: i })),
        links: [...Array(N).keys()]
            .filter((id) => id)
            .map((id) => ({
                [reverse ? "target" : "source"]: id,
                [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
            })),
    };
};

export const deepCopyData = (data: any) => JSON.parse(JSON.stringify(data));
