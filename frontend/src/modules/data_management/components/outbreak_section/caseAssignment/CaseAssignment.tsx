import { useEffect, useMemo, useState } from "react";
import {
    type MRT_TableOptions,
    type MRT_ColumnDef,
    type MRT_Row,
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/core/components/ui/Select";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/modules/core/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import i18next, { t } from "i18next";
import { formatDate } from "@/modules/core/helpers/dates";
import { MRT_Localization_DE } from "material-react-table/locales/de";

export const CaseAssignment = () => {
    const noOutbreakAssignedId = "0";
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const outbreaks = useGetOutbreaksForActivePathogen();
    const noOutbreakIsAssigned = cases?.some((caseData) => !caseData.outbreak);
    const [casesInTable1, setCasesInTable1] = useState<CaseWithRelationships[]>([]);
    const [casesInTable2, setCasesInTable2] = useState<CaseWithRelationships[]>([]);

    const [draggingRow, setDraggingRow] = useState<MRT_Row<CaseWithRelationships> | null>(null);
    const [hoveredTable, setHoveredTable] = useState<string | null>(null);

    const [casesCopy, setCasesCopy] = useState(cases);
    const [hoveredTableIsForbidden, setHoveredTableIsForbidden] = useState(false);
    const [casesForUpdate, setCasesForUpdate] = useState<CaseWithRelationships[]>([]);
    const [selectedOutbreakTable1, setSelectedOutbreakTable1] = useState<string | undefined>();
    const [selectedOutbreakTable2, setSelectedOutbreakTable2] = useState<string | undefined>();

    const columns = useMemo<MRT_ColumnDef<CaseWithRelationships>[]>(
        //column definitions...
        () => [
            {
                accessorKey: "case_id",
                header: "Fall ID",
                enableColumnActions: false,
            },
            {
                accessorKey: "outbreak.name",
                accessorFn: (originalRow) => {
                    const outbreakName = originalRow.outbreak?.name ?? i18next.t("clusterTypes.noOutbreakAssigned");
                    if (
                        originalRow.outbreak_id === originalRow.outbreak?.id ||
                        (!originalRow.outbreak_id && !originalRow.outbreak?.id)
                    ) {
                        return outbreakName;
                    } else {
                        const originalOutbreakName =
                            outbreaks?.find((outbreak) => outbreak.id === originalRow.outbreak_id)?.name ??
                            i18next.t("clusterTypes.noOutbreakAssigned");
                        return (
                            <div>
                                <del>{outbreakName}</del> <p>{originalOutbreakName}</p>
                            </div>
                        );
                    }
                },

                header: "Ausbruch",
                enableColumnActions: false,
                enableSorting: false,
            },
            {
                accessorKey: "registered_at",
                accessorFn: (originalRow) => formatDate(originalRow.registered_at),
                header: "Registrierungsdatum",
                enableColumnActions: false,
            },
        ],
        [outbreaks]
        //end
    );

    useEffect(() => {
        if (cases) {
            setCasesCopy(structuredClone(cases));
        }
    }, [cases]);

    const commonTableProps: Partial<MRT_TableOptions<CaseWithRelationships>> & {
        columns: MRT_ColumnDef<CaseWithRelationships>[];
    } = {
        columns,
        enableRowDragging: true,
        enableFullScreenToggle: false,
        muiTableContainerProps: {
            sx: {
                minHeight: "75%",
                maxHeight: "70%",
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontFamily: "Merriweather, sans-serif",
                fontWeight: "normal",
                fontSize: "0.85rem",
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontFamily: "Merriweather, sans-serif",
                fontWeight: "normal",
                fontSize: "0.8rem",
            },
        },
        onDraggingRowChange: setDraggingRow,
        state: {
            draggingRow,
        },
        localization: MRT_Localization_DE,
        enableDensityToggle: false,
        enableHiding: false,
        enableColumnFilters: false,
        muiPaginationProps: {
            showRowsPerPage: false,
        },
        positionGlobalFilter: "right",
        initialState: {
            showGlobalFilter: true,
        },
        //adjust height of tooltip
        muiTopToolbarProps: {
            sx: {
                gap: "0px",
                height: "55px",
            },
        },
    };

    const table1 = useMaterialReactTable({
        ...commonTableProps,
        data: casesInTable1,
        getRowId: (originalRow) => `table-1-${originalRow.case_id}`,
        muiRowDragHandleProps: {
            onDragEnd: () => {
                if (
                    hoveredTable === "table-2" &&
                    selectedOutbreakTable1 !== selectedOutbreakTable2 &&
                    selectedOutbreakTable1 &&
                    selectedOutbreakTable2
                ) {
                    setCasesInTable2((data2) => [...data2, draggingRow!.original]);
                    setCasesInTable1((data1) => data1.filter((d) => d !== draggingRow!.original));
                    setCasesForUpdate((prevCases) => {
                        if (selectedOutbreakTable2 === undefined) {
                            return prevCases;
                        }
                        const newCase = draggingRow!.original;
                        newCase.outbreak_id = +selectedOutbreakTable2;
                        return [...prevCases, newCase];
                    });
                }
                setHoveredTable(null);
            },
        },
        muiTablePaperProps: {
            onDragEnter: () => {
                setHoveredTable("table-1");
                if (!selectedOutbreakTable1) {
                    setHoveredTableIsForbidden(true);
                } else {
                    setHoveredTableIsForbidden(false);
                }
            },
            sx: {
                outline:
                    hoveredTable === "table-1" && !hoveredTableIsForbidden
                        ? "2px dashed green"
                        : hoveredTable === "table-1" && hoveredTableIsForbidden
                        ? "2px dashed red"
                        : undefined,
                width: "100%",
            },
        },
        renderTopToolbarCustomActions: () => (
            <Select
                onValueChange={(outbreakId) => {
                    setSelectedOutbreakTable1(outbreakId);
                    changeCasesInTable(outbreakId, casesCopy, setCasesInTable1);
                }}
            >
                <SelectTrigger className="mb-7">
                    <SelectValue placeholder="Ausbruch auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {outbreaks?.map((outbreak) => {
                        if (selectedOutbreakTable2 && outbreak.id === +selectedOutbreakTable2) return;
                        return (
                            <SelectItem key={outbreak.id} value={outbreak.id.toString()}>
                                {outbreak.name}
                            </SelectItem>
                        );
                    })}
                    {noOutbreakIsAssigned && selectedOutbreakTable2 !== noOutbreakAssignedId && (
                        <SelectItem value={noOutbreakAssignedId}>{t("clusterTypes.noOutbreakAssigned")}</SelectItem>
                    )}
                </SelectContent>
            </Select>
        ),
    });

    const table2 = useMaterialReactTable({
        ...commonTableProps,
        data: casesInTable2,
        getRowId: (originalRow) => `table-2-${originalRow.case_id}`,
        muiRowDragHandleProps: {
            onDragEnd: () => {
                if (
                    hoveredTable === "table-1" &&
                    selectedOutbreakTable1 !== selectedOutbreakTable2 &&
                    selectedOutbreakTable1 &&
                    selectedOutbreakTable2
                ) {
                    setCasesInTable1((data1) => [...data1, draggingRow!.original]);
                    setCasesInTable2((data2) => data2.filter((d) => d !== draggingRow!.original));
                    setCasesForUpdate((prevCases) => {
                        if (selectedOutbreakTable1 === undefined) {
                            return prevCases;
                        }
                        const newCase = draggingRow!.original;
                        newCase.outbreak_id = +selectedOutbreakTable1;
                        return [...prevCases, newCase];
                    });
                }
                setHoveredTable(null);
            },
        },
        muiTablePaperProps: {
            onDragEnter: () => {
                setHoveredTable("table-2");
                if (!selectedOutbreakTable2) {
                    setHoveredTableIsForbidden(true);
                } else {
                    setHoveredTableIsForbidden(false);
                }
            },
            sx: {
                outline:
                    hoveredTable === "table-2" && !hoveredTableIsForbidden
                        ? "2px dashed green"
                        : hoveredTable === "table-2" && hoveredTableIsForbidden
                        ? "2px dashed red"
                        : undefined,
                width: "100%",
            },
        },
        renderTopToolbarCustomActions: () => (
            <Select
                onValueChange={(outbreakId) => {
                    setSelectedOutbreakTable2(outbreakId);
                    changeCasesInTable(outbreakId, casesCopy, setCasesInTable2);
                }}
            >
                <SelectTrigger className="mb-7">
                    <SelectValue placeholder="Ausbruch auswählen" />
                </SelectTrigger>
                <SelectContent>
                    {outbreaks?.map((outbreak) => {
                        if (selectedOutbreakTable1 && outbreak.id === +selectedOutbreakTable1) return;
                        return (
                            <SelectItem key={outbreak.id} value={outbreak.id.toString()}>
                                {outbreak.name}
                            </SelectItem>
                        );
                    })}
                    {noOutbreakIsAssigned && selectedOutbreakTable1 !== noOutbreakAssignedId && (
                        <SelectItem value={noOutbreakAssignedId}>{t("clusterTypes.noOutbreakAssigned")}</SelectItem>
                    )}
                </SelectContent>
            </Select>
        ),
    });

    const changeCasesInTable = (
        outbreakId: string,
        cases: CaseWithRelationships[] | undefined,
        setCasesInTable: (cases: CaseWithRelationships[]) => void
    ) => {
        if (!cases) return;
        let casesFilteredByOutbreak: CaseWithRelationships[] = [];
        if (outbreakId === noOutbreakAssignedId) {
            casesFilteredByOutbreak = cases.filter((caseData) => !caseData.outbreak_id);
        } else {
            casesFilteredByOutbreak = cases.filter((caseData) => caseData.outbreak_id?.toString() === outbreakId);
        }

        setCasesInTable(casesFilteredByOutbreak);
    };

    return (
        <div className="flex space-x-3 w-full max-h-[calc(100vh-270px)] h-[calc(100vh-270px)]">
            <MaterialReactTable table={table1} />
            <MaterialReactTable table={table2} />
        </div>
    );
};
