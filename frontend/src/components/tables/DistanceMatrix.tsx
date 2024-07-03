import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DistanceMatrix as DistanceMatrixSchema, getDistanceMatrix } from "@/database/db";
import { useEffect, useState } from "react";

export function DistanceMatrix() {
    const [matrixData, setMatrixData] = useState<DistanceMatrixSchema | undefined>();
    // how to listen for new data? context?
    useEffect(() => {
        const loadMatrixData = async () => {
            setMatrixData(await getDistanceMatrix());
        };
        loadMatrixData();
    }, []);
    return (
        <>
            {matrixData && (
                <Table className="rounded-xl overflow-hidden">
                    <TableBody>
                        <TableRow className="bg-muted">
                            <TableCell className="font-medium"></TableCell>
                            {matrixData.row_column_names.map((name, index) => (
                                <TableCell key={index} className="font-medium p-2 text-center">
                                    {name}
                                </TableCell>
                            ))}
                        </TableRow>
                        {matrixData.matrix.map((row, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium bg-muted p-2 text-center">
                                        {matrixData.row_column_names[index]}
                                    </TableCell>
                                    {row.map((col, index) => (
                                        <TableCell key={index} className="border-r-[1px] p-2 text-center">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </>
    );
}
