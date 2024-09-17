import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/core/components/ui/Card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/modules/core/components/ui/chart";
import { useMemo } from "react";
import { useDashboardStore } from "../../stores/dashboard";

const chartData = [
    { outbreak: "chrome", cases: 275, fill: "var(--color-chrome)" },
    { outbreak: "safari", cases: 200, fill: "var(--color-safari)" },
    { outbreak: "firefox", cases: 287, fill: "var(--color-firefox)" },
    { outbreak: "edge", cases: 173, fill: "var(--color-edge)" },
];

export const CasesPerClusterChart = () => {
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);

    const totalCases = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.cases, 0);
    }, []);

    const chartConfig = useMemo(() => {
        return {
            cases: {
                label: "Fälle",
            },
            chrome: {
                label: "Chrome",
                color: "hsl(var(--chart-1))",
            },
            safari: {
                label: "Safari",
                color: "hsl(var(--chart-2))",
            },
            firefox: {
                label: "Firefox",
                color: "hsl(var(--chart-3))",
            },
            edge: {
                label: "Edge",
                color: "hsl(var(--chart-4))",
            },
            other: {
                label: "Other",
                color: "hsl(var(--chart-5))",
            },
        } satisfies ChartConfig;
    }, [colorMap]);

    return (
        <Card>
            <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-xl font-semibold leading-none tracking-tight">Fälle pro Ausbruch</CardTitle>
                <CardDescription>Zeigt die Gesamtanzahl der Fälle verteilt auf die Ausbrüche.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto min-h-[150px] mb-3 mt-2 h-[150px] aspect-auto">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="cases"
                            nameKey="outbreak"
                            innerRadius={50}
                            outerRadius={75}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalCases.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Fälle
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
