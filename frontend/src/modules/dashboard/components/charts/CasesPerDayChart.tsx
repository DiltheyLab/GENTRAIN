import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/core/components/ui/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/modules/core/components/ui/chart";
import { useMemo } from "react";
import { useDashboardStore } from "../../stores/dashboard";
import { getUniqueClustersOfNodes, moveNoOutbreakAssignedToEnd } from "@/modules/core/helpers/graphs";
import { formatDate } from "@/modules/core/helpers/dates.ts";

type ChartData = {
    day: string;
    [cluster: string]: number | string;
};

const CasesPerDayChart = () => {
    const nodes = useDashboardStore((state) => state.graphData.nodes);
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);
    const clusters = useMemo(() => {
        const clusters = getUniqueClustersOfNodes(nodes).map((node) => node.cluster);
        const reorderedClusters = moveNoOutbreakAssignedToEnd(clusters);
        return reorderedClusters;
    }, [nodes]);

    const chartData = useMemo(() => {
        const dateMap = new Map<string, Map<string, number>>();
        for (const node of nodes) {
            const key = formatDate(node.caseData.registered_at);
            // if there is no date key in the dateMap we create a key with every cluster
            if (!dateMap.has(key)) {
                dateMap.set(key, new Map());

                const clusterMap = dateMap.get(key)!;
                // as default we initialize all cluster with 0 cases
                for (const cluster of clusters) {
                    clusterMap.set(cluster, 0);
                }
                clusterMap.set(node.cluster, 1);
            } else {
                const clusterMap = dateMap.get(key);
                // if there is a date key in dateMap we have to check if there is already a cluster, if so we add 1
                if (clusterMap?.has(node.cluster)) {
                    clusterMap.set(node.cluster, clusterMap.get(node.cluster)! + 1);
                }
            }
        }

        const chartData: ChartData[] = [];
        for (const [date, clusterMap] of dateMap) {
            const clusters = {} as Record<string, number>;
            for (const [key, value] of clusterMap) {
                clusters[key] = value;
            }
            chartData.push({ day: date, ...clusters });
        }

        return chartData;
    }, [nodes]);

    return (
        <Card className="z-10">
            <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold leading-none">Fälle pro Tag</CardTitle>
                <CardDescription>Zeigt die Fälle die an den Tagen aufgetreten sind.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-2">
                <ChartContainer config={{}} className="min-h-24 w-full h-32">
                    {nodes.length !== 0 ? (
                        <AreaChart accessibilityLayer data={chartData} margin={{ left: -28, right: 10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={5}
                                tickFormatter={(value) => value}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={5} />
                            <ChartTooltip
                                wrapperStyle={{ width: "180px" }}
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                                allowEscapeViewBox={{ x: true, y: true }}
                                offset={18}
                            />
                            {clusters.map((cluster) => {
                                return (
                                    <Area
                                        key={cluster}
                                        dataKey={cluster}
                                        type="monotone"
                                        fill={colorMap[cluster].color}
                                        fillOpacity={0.4}
                                        stroke={colorMap[cluster].color}
                                    />
                                );
                            })}
                        </AreaChart>
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

export default CasesPerDayChart;
