import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/core/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/modules/core/components/ui/chart";
import { useMemo } from "react";
import { useDashboardStore } from "../../stores/dashboard";

type ChartData = {
    cluster: string;
    cases: number;
    fill: string;
};

const CasesPerClusterChart = () => {
    const nodes = useDashboardStore((state) => state.graphData.nodes);
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);

    const chartData = useMemo(() => {
        const clusterMap = new Map<string, number>();
        for (const node of nodes) {
            const key = node.cluster;
            if (!clusterMap.has(key)) {
                clusterMap.set(key, 1);
            } else {
                clusterMap.set(node.cluster, clusterMap.get(node.cluster)! + 1);
            }
        }

        const chartData: ChartData[] = [];
        for (const [cluster, cases] of clusterMap) {
            chartData.push({ cluster: cluster, cases, fill: colorMap[cluster].color });
        }

        return chartData;
    }, [nodes]);

    const totalCases = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.cases, 0);
    }, [nodes]);

    return (
        <Card className="hidden tall:block">
            <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-xl font-semibold leading-none">Fälle pro Ausbruch/Cluster</CardTitle>
                <CardDescription>Zeigt die Gesamtanzahl der Fälle verteilt auf die Ausbrüche/Cluster.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}} className="mx-auto min-h-[145px] mb-1 h-[145px] aspect-auto">
                    {nodes.length !== 0 ? (
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                wrapperStyle={{ width: "150px" }}
                            />
                            <Pie data={chartData} dataKey="cases" nameKey="cluster" innerRadius={40} outerRadius={65}>
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
                                                        className="fill-foreground text-2xl font-bold"
                                                    >
                                                        {totalCases.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 20}
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
                    ) : (
                        <small className="w-full h-full flex justify-center items-center font-light text-base">
                            Keine Daten
                        </small>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default CasesPerClusterChart;
