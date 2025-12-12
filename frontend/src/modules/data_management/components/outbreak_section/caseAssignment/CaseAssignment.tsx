import { useMemo, useState } from "react";
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
import { GripHorizontalIcon } from "lucide-react";
import { useCopyCases } from "@/modules/data_management/hooks/useCopyCases";

type CaseAssigmentProps = {
    registerCaseForDatabaseUpdate: (caseData: CaseWithRelationships, selectedOutbreakTable: string) => void;
};

const CaseAssignment = ({ registerCaseForDatabaseUpdate }: CaseAssigmentProps) => {
    const noOutbreakAssignedId = "0";
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const outbreaks = useGetOutbreaksForActivePathogen();
    const noOutbreakIsAssigned = cases?.some((caseData) => !caseData.outbreak);
    const [casesInTable1, setCasesInTable1] = useState<CaseWithRelationships[]>([]);
    const [casesInTable2, setCasesInTable2] = useState<CaseWithRelationships[]>([]);
    const [draggingRow, setDraggingRow] = useState<MRT_Row<CaseWithRelationships> | null>(null);
    const [hoveredTable, setHoveredTable] = useState<string | null>(null);
    const casesCopy = useCopyCases(cases);
    const [hoveredTableIsForbidden, setHoveredTableIsForbidden] = useState(false);
    const [selectedOutbreakTable1, setSelectedOutbreakTable1] = useState<string | undefined>();
    const [selectedOutbreakTable2, setSelectedOutbreakTable2] = useState<string | undefined>();

    const columns = useMemo<MRT_ColumnDef<CaseWithRelationships>[]>(
        //column definitions...
        () => [
            {
                accessorKey: "case_id",
                header: "Fall ID",
                enableColumnActions: false,
                size: 100,
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
                size: 150,
            },
            {
                accessorKey: "registered_at",
                accessorFn: (originalRow) => formatDate(originalRow.registered_at),
                header: "Registrierungsdatum",
                enableColumnActions: false,
                size: 50,
            },
        ],
        [outbreaks]
        //end
    );

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
        muiTableHeadProps: {
            sx: {
                boxShadow: "none",
                "& .MuiTableRow-root": {
                    boxShadow: "none",
                },
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
        muiTableBodyRowProps: () => ({
            draggable: true,
            sx: {
                cursor: "grab",
                "&:active": {
                    outline: "none",
                },
            },
            onDragStart: (event) => {
                event.dataTransfer.setData("text/plain", "");
            },
        }),
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
                display: "flex",
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#e5e7eb",
                    },
                    "&:hover fieldset": {
                        borderColor: "#e5e7eb",
                    },
                    "&.Mui-focused fieldset": {
                        boxShadow: "0 0 0 2px black",
                        border: "none",
                    },
                },
            },
        },
        icons: {
            DragHandleIcon: () => <GripHorizontalIcon />,
        },
        layoutMode: "semantic",
    };

    const table1 = useMaterialReactTable({
        ...commonTableProps,
        data: casesInTable1,
        getRowId: (originalRow) => `table-1-${originalRow.case_id}`,
        muiTableBodyRowProps: ({ row }) => ({
            draggable: true,
            sx: {
                cursor: "grab",
            },
            onDragStart: (event) => {
                setDraggingRow(row);
                event.dataTransfer.setData("text/plain", "");
            },
            onDragEnd: () => {
                if (hoveredTable === "table-2" && selectedOutbreakTable2) {
                    setCasesInTable2((data2) => [row.original, ...data2]);
                    setCasesInTable1((data1) => data1.filter((d) => d !== row.original));
                    registerCaseForDatabaseUpdate(row.original, selectedOutbreakTable2);
                }
                setHoveredTable(null);
                setDraggingRow(null);
            },
        }),
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
                border:
                    hoveredTable === "table-1" && !hoveredTableIsForbidden
                        ? "2px dashed hsla(25,5%,45%,0.3)"
                        : hoveredTable === "table-1" && hoveredTableIsForbidden
                          ? "2px dashed red"
                          : "2px dashed hsla(25,5%,45%,0.1)",
                width: "100%",
                boxShadow: "none",
                borderRadius: "0.5rem",
            },
        },
        renderTopToolbarCustomActions: () => (
            <Select
                onValueChange={(outbreakId) => {
                    setSelectedOutbreakTable1(outbreakId);
                    changeCasesInTable(outbreakId, casesCopy, setCasesInTable1);
                }}
            >
                <SelectTrigger className="mt-2 h-[37px]">
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
        muiTableBodyRowProps: ({ row }) => ({
            draggable: true,
            sx: {
                cursor: "grab",
            },
            onDragStart: (event) => {
                setDraggingRow(row);
                event.dataTransfer.setData("text/plain", "");
            },
            onDragEnd: () => {
                if (hoveredTable === "table-1" && selectedOutbreakTable1) {
                    setCasesInTable1((data1) => [row.original, ...data1]);
                    setCasesInTable2((data2) => data2.filter((d) => d !== row.original));
                    registerCaseForDatabaseUpdate(row.original, selectedOutbreakTable1);
                }
                setHoveredTable(null);
                setDraggingRow(null);
            },
        }),
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
                border:
                    hoveredTable === "table-2" && !hoveredTableIsForbidden
                        ? "2px dashed hsla(25,5%,45%,0.3)"
                        : hoveredTable === "table-2" && hoveredTableIsForbidden
                          ? "2px dashed red"
                          : "2px dashed hsla(25,5%,45%,0.1)",
                width: "100%",
                boxShadow: "none",
                borderRadius: "0.5rem",
            },
        },
        renderTopToolbarCustomActions: () => (
            <Select
                onValueChange={(outbreakId) => {
                    setSelectedOutbreakTable2(outbreakId);
                    changeCasesInTable(outbreakId, casesCopy, setCasesInTable2);
                }}
            >
                <SelectTrigger className="mt-2 h-[37px]">
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
        <div className="flex space-x-3 w-full overflow-x-auto max-h-[calc(100vh-270px)] h-[calc(100vh-270px)]">
            <MaterialReactTable table={table1} />
            <MaterialReactTable table={table2} />
        </div>
    );
};

export default CaseAssignment;
