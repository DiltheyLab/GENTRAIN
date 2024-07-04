import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DistanceMatrix as DistanceMatrixSchema, getDistanceMatrix } from "@/database/db";
import { useEffect, useState } from "react";

export function DistanceMatrix() {
    const [matrixData, setMatrixData] = useState<DistanceMatrixSchema | undefined>();
    const [hoveredRow, setHoveredRow] = useState<number | undefined>();
    const [hoveredColumn, setHoveredColumn] = useState<number | undefined>();

    // how to listen for new data? context?
    useEffect(() => {
        const loadMatrixData = async () => {
            setMatrixData(await getDistanceMatrix());
        };
        loadMatrixData();
    }, []);

    const renderColumn = (cellValue: number, colIndex: number, rowIndex: number) => {
        return (
            <TableCell
                key={colIndex}
                className={`border-r-[1px] border-muted p-2 text-center text-xs ${
                    hoveredColumn === colIndex && hoveredRow === rowIndex
                        ? "bg-muted"
                        : hoveredColumn === colIndex
                        ? "bg-muted/30"
                        : null
                }`}
                onMouseEnter={() => setHoveredColumn(colIndex)}
                onMouseLeave={() => setHoveredColumn(undefined)}
            >
                {cellValue}
            </TableCell>
        );
    };

    const renderRows = () => {
        if (matrixData) {
            return matrixData.matrix.map((row, rowIndex) => {
                return (
                    <TableRow
                        key={rowIndex}
                        className="border-b-[1px] border-r-[1px] border-muted p-2"
                        onMouseEnter={() => setHoveredRow(rowIndex)}
                        onMouseLeave={() => setHoveredRow(undefined)}
                    >
                        <TableCell
                            className={`border-r-[1px] border-muted font-medium p-2 text-center text-xs ${
                                hoveredRow === rowIndex ? "bg-muted" : "bg-muted/30"
                            }`}
                        >
                            {matrixData.row_column_names[rowIndex]}
                        </TableCell>
                        {row.map((cellValue, colIndex) => renderColumn(cellValue, colIndex, rowIndex))}
                    </TableRow>
                );
            });
        }
    };

    return (
        <>
            {matrixData && (
                <Table className="rounded-xl overflow-hidden border-b-[1px] border-muted">
                    <TableBody>
                        <TableRow className="bg-muted/30 border-r-[1px] border-muted p-2">
                            <TableCell className="border-r-[1px] border-muted font-medium"></TableCell>
                            {matrixData.row_column_names.map((name, index) => (
                                <TableCell
                                    key={index}
                                    style={{ writingMode: "vertical-rl" }}
                                    className={`border-r-[1px] border-muted p-2 font-medium text-center text-xs rotate-180 ${
                                        hoveredColumn === index ? "bg-muted" : "bg-muted/30"
                                    }`}
                                >
                                    {name}
                                </TableCell>
                            ))}
                        </TableRow>
                        {renderRows()}
                    </TableBody>
                </Table>
            )}
        </>
    );
}
