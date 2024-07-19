import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetDistanceMatrixByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixByPathogenId";
import { useAppStore } from "@/stores/app";
import { useState } from "react";

export function DistanceMatrixTable() {
    const activePathogen = useAppStore((state) => state.activePathogen);
    const [hoveredRow, setHoveredRow] = useState<number | undefined>();
    const [hoveredColumn, setHoveredColumn] = useState<number | undefined>();
    const distanceMatrix = useGetDistanceMatrixByPathogenId(activePathogen?.id);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);

    const renderRow = (rowKey: string, rowIndex: number) => {
        if (distanceMatrixAssembly) {
            return (
                <TableRow key={rowKey}>
                    <TableCell
                        key={rowKey}
                        className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 font-medium text-center text-xs w-[100px] ${
                            hoveredRow === rowIndex ? "bg-muted font-bold" : "bg-muted/50"
                        }`}
                    >
                        {rowKey}
                    </TableCell>
                    {Object.keys(distanceMatrixAssembly)
                        .sort()
                        .map((colKey, colIndex) => {
                            return (
                                <TableCell
                                    key={colKey}
                                    className={`[&:not(:last-child)]:border-r-[1px] border-muted font-medium p-2 text-center text-xs hover:font-bold ${
                                        hoveredRow === rowIndex || hoveredColumn === colIndex
                                            ? "bg-muted"
                                            : "bg-muted/20"
                                    }`}
                                    onMouseEnter={() => {
                                        setHoveredColumn(colIndex);
                                        setHoveredRow(rowIndex);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredColumn(undefined);
                                        setHoveredRow(undefined);
                                    }}
                                >
                                    {distanceMatrixAssembly[rowKey][colKey] ?? "-"}
                                </TableCell>
                            );
                        })}
                </TableRow>
            );
        }
    };

    return (
        <>
            {distanceMatrix && distanceMatrixAssembly && (
                <>
                    <small>Letzte Änderung: {distanceMatrix.updated_at?.toLocaleString()}</small>
                    <div className="mt-4 border-[1px] border-muted rounded-xl overflow-hidden">
                        <Table>
                            <TableBody>
                                <TableRow className="bg-muted/30 border-muted p-2">
                                    <TableCell className="border-r-[1px] border-muted font-medium"></TableCell>
                                    {Object.keys(distanceMatrixAssembly)
                                        .sort()
                                        .map((key, index) => (
                                            <TableCell
                                                key={key}
                                                style={{ writingMode: "vertical-rl" }}
                                                className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 font-medium text-center text-xs rotate-180 h-[100px] ${
                                                    hoveredColumn === index ? "bg-muted font-bold" : "bg-muted/50"
                                                }`}
                                            >
                                                {key}
                                            </TableCell>
                                        ))}
                                </TableRow>
                                {Object.keys(distanceMatrixAssembly)
                                    .sort()
                                    .map((key, index) => renderRow(key, index))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </>
    );
}
