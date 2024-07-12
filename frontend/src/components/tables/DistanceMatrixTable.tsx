import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetDistanceMatrixByPathogenId } from "@/hooks/database/distance_matrix/useGetDistanceMatrixByPathogenId";
import { useAppStore } from "@/stores/app";
import { useState } from "react";

export function DistanceMatrixTable() {
    const activePathogen = useAppStore((state) => state.activePathogen);
    const [hoveredRow, setHoveredRow] = useState<number | undefined>();
    const [hoveredColumn, setHoveredColumn] = useState<number | undefined>();
    const matrixData = useGetDistanceMatrixByPathogenId(activePathogen?.id);

    const renderColumn = (cellValue: number, colIndex: number, rowIndex: number) => {
        return (
            <TableCell
                key={colIndex}
                className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 text-center text-xs ${
                    hoveredColumn === colIndex && hoveredRow === rowIndex
                        ? "bg-muted font-bold"
                        : hoveredColumn === colIndex
                        ? "bg-muted/20"
                        : null
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
                {cellValue !== -1 ? cellValue : "-"}
            </TableCell>
        );
    };

    const renderRows = () => {
        if (matrixData) {
            return matrixData.matrix.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex} className="border-b-[1px] border-muted p-2">
                        <TableCell
                            className={`[&:not(:last-child)]:border-r-[1px] border-muted font-medium p-2 text-center text-xs w-[100px] ${
                                hoveredRow === rowIndex ? "bg-muted font-bold" : "bg-muted/20"
                            }`}
                        >
                            {matrixData.row_column_names[rowIndex]}
                        </TableCell>
                        {row.map((cellValue, colIndex) => {
                            return renderColumn(cellValue, colIndex, rowIndex);
                        })}
                    </TableRow>
                );
            });
        }
    };

    return (
        <>
            {matrixData && (
                <>
                    <small>Letzte Änderung: {matrixData.updated_at.toLocaleString()}</small>
                    <div className="mt-4 border-[1px] border-muted rounded-xl overflow-hidden">
                        <Table>
                            <TableBody>
                                <TableRow className="bg-muted/30 border-muted p-2">
                                    <TableCell className="border-r-[1px] border-muted font-medium"></TableCell>
                                    {matrixData.row_column_names.map((name, index) => (
                                        <TableCell
                                            key={index}
                                            style={{ writingMode: "vertical-rl" }}
                                            className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 font-medium text-center text-xs rotate-180 h-[100px] ${
                                                hoveredColumn === index ? "bg-muted font-bold" : "bg-muted/20"
                                            }`}
                                        >
                                            {name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {renderRows()}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </>
    );
}
