import { Table, TableBody, TableCell, TableRow } from "@/modules/core/components/ui/Table";
import { useGetDistanceMatrixAssembly } from "@/modules/core/hooks/database/distance_matrices/useGetDistanceMatrixAssembly";
import { useGetDistanceMatrix } from "@/modules/core/hooks/database/distance_matrices/useGetDistanceMatrix";
import { useState } from "react";
import { Button } from "@/modules/core/components/ui/Button";
import { downloadFile } from "@/modules/core/helpers/files";
import { useCoreStore } from "@/modules/core/stores/core";

export function DistanceMatrixTable() {
    const [hoveredRow, setHoveredRow] = useState<number | undefined>();
    const [hoveredColumn, setHoveredColumn] = useState<number | undefined>();
    const distanceMatrix = useGetDistanceMatrix();
    const distanceMatrixAssembly = useGetDistanceMatrixAssembly();
    const activePathogen = useCoreStore.getState().activePathogen;

    const exportDistanceMatrixAsCsv = () => {
        const entries = Object.entries(distanceMatrixAssembly as object).sort();
        let distanceMatrixCsvContent = `;${entries.map((entry) => entry[0]).join(";")}\r\n`;
        for (const index in entries) {
            const fastaId = entries[index][0];
            const distances = entries[index][1];
            // sort distance array to sorted fasta ids
            const sortedDistances = Object.keys(distances)
                .sort()
                .reduce((obj: any, key) => {
                    obj[key] = distances[key];
                    return obj;
                }, {});
            const distancesArray = Object.values(sortedDistances);
            // add "-" for identic row / column pair
            distancesArray.splice(parseInt(index), 0, "-");
            distanceMatrixCsvContent += `${fastaId};${distancesArray.join(";")}\r\n`;
        }
        downloadFile(
            new Blob([distanceMatrixCsvContent], { type: "text/csv" }),
            `${activePathogen?.name.replace(" ", "-").toLowerCase()}_gentrain_distanzmatrix.csv`
        );
    };

    const renderRow = (rowKey: string, rowIndex: number) => {
        if (distanceMatrixAssembly) {
            return (
                <TableRow key={rowKey}>
                    <TableCell
                        key={rowKey}
                        className={`sticky left-0 [&:not(:last-child)]:border-r-[1px] border-muted p-2 font-medium text-center text-xs bg-muted`}
                    >
                        {rowKey}
                    </TableCell>
                    {Object.keys(distanceMatrixAssembly)
                        .sort()
                        .map((colKey, colIndex) => {
                            return (
                                <TableCell
                                    key={colKey}
                                    className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 text-center text-xs hover:font-bold select-none ${
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
            {distanceMatrix && distanceMatrixAssembly ? (
                <>
                    <div className="flex justify-between items-center">
                        <small>Letzte Änderung: {distanceMatrix.updated_at?.toLocaleString()}</small>
                        <Button onClick={exportDistanceMatrixAsCsv} variant="secondary">
                            Distanzmatrix exportieren
                        </Button>
                    </div>
                    <div className="mt-4 border-[1px] border-muted rounded-xl relative w-full overflow-auto max-h-[50rem]">
                        <Table>
                            <TableBody>
                                <TableRow className="border-muted p-2 sticky top-0 z-10 bg-muted">
                                    <TableCell className="border-r-[1px] border-muted font-medium bg-white sticky left-0 top-0 z-10"></TableCell>
                                    {Object.keys(distanceMatrixAssembly)
                                        .sort()
                                        .map((key) => (
                                            <TableCell
                                                key={key}
                                                style={{ writingMode: "vertical-rl" }}
                                                className={`[&:not(:last-child)]:border-r-[1px] border-muted p-2 font-medium text-center text-xs rotate-180 bg-muted`}
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
            ) : (
                <p>Keine sequenzierten Daten vorhanden.</p>
            )}
        </>
    );
}
