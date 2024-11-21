import {Row, Table} from "@tanstack/react-table";
import {useGetCaseTableData} from "@/modules/data_management/hooks/useGetCaseTableData";
import {DataTable} from "@/modules/core/components/tables/DataTable";
import {useDataManagementStore} from "@/modules/data_management/stores/dataManagement";
import {Checkbox} from "@/modules/core/components/ui/Checkbox";
import {Label} from "@/modules/core/components/ui/Label";
import {useEffect, useState} from "react";
import {CaseImport, CaseWithRelationships} from "@/modules/core/models/cases";
import {caseImportFilterFn} from "@/modules/data_management/helpers/dataTable";
import {caseSelectionColumns} from "./caseSelectionColumns";

export function CaseSelection() {
    const caseTableData = useGetCaseTableData();
    const changeCaseImport = useDataManagementStore((state) => state.changeCaseImport);
    const [table, setTable] = useState<Table<CaseImport> | null>(null);
    const [selectAll, setSelectAll] = useState(true);
    const [selectCasesWithSequence, setSelectCasesWithSequence] = useState(false);
    const [selectCasesWithOutbreak, setSelectCasesWithOutbreak] = useState(false);

    useEffect(() => {
        if (!table) return;
        const allRows = Object.keys(table.getRowModel().rowsById).map((key) => table.getRowModel().rowsById[key]);
        allRows.forEach((row: Row<CaseImport>) => {
            row.toggleSelected(
                selectAll ||
                (selectCasesWithSequence && row.original.fasta_id !== null) ||
                (selectCasesWithOutbreak && row.original.outbreak !== null)
            );
            changeCaseImport(row.original.case_id!, {
                import:
                    selectAll ||
                    (selectCasesWithSequence && row.original.fasta_id !== null) ||
                    (selectCasesWithOutbreak && row.original.outbreak !== null),
            });
        });
    }, [selectAll, selectCasesWithSequence, selectCasesWithOutbreak]);

    const getRowStyle = (row: Row<any>) => {
        if(!row.original.existingCase) {
            return {
                backgroundColor: "#f7fee7"
            }
        }
        return {
            backgroundColor: "#fefce8"
        };
    }
    return (
        <>
            {caseTableData && (
                <DataTable
                    onInit={(table) => setTable(table)}
                    data={caseTableData}
                    columns={caseSelectionColumns}
                    pageSize={5}
                    filterFn={caseImportFilterFn}
                    onRowClick={(row: any) => {
                        if (!row.original.case_id) return;
                        changeCaseImport(row.original.case_id!, {import: !row.getIsSelected()});
                        row.toggleSelected(!row.getIsSelected());
                    }}
                    setRowStyle={(row) => getRowStyle(row)}
                    preselectRows
                    selectionLabel="Fällen"
                    actions={() => {
                        return (
                            <div className="flex gap-3">
                                <div className="flex items-center">
                                    <Checkbox
                                        id="selectAll"
                                        className="mr-2"
                                        checked={selectAll}
                                        onCheckedChange={(value) => {
                                            setSelectAll(value ? true : false);
                                            if (value) {
                                                setSelectCasesWithSequence(false);
                                                setSelectCasesWithOutbreak(false);
                                            }
                                        }}
                                        aria-label="Select all"
                                    />
                                    <Label htmlFor="selectAll" className="font-normal mt-[2px] ">
                                        Alle Fälle auswählen
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="selectWithSequence"
                                        className="mr-2"
                                        checked={selectCasesWithSequence}
                                        onCheckedChange={(value) => {
                                            setSelectCasesWithSequence(value ? true : false);
                                            if (value) {
                                                setSelectAll(false);
                                            }
                                        }}
                                        aria-label="Select with sequence"
                                    />
                                    <Label htmlFor="selectWithSequence" className="font-normal mt-[2px] ">
                                        Fälle mit Sequenz auswählen
                                    </Label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox
                                        id="selectWithOutbreak"
                                        className="mr-2"
                                        checked={selectCasesWithOutbreak}
                                        onCheckedChange={(value) => {
                                            setSelectCasesWithOutbreak(value ? true : false);
                                            if (value) {
                                                setSelectAll(false);
                                            }
                                        }}
                                        aria-label="Select with outbreak"
                                    />
                                    <Label htmlFor="selectWithOutbreak" className="font-normal mt-[2px] ">
                                        Fälle mit Ausbruch auswählen
                                    </Label>
                                </div>
                            </div>
                        );
                    }}
                />
            )}
        </>
    );
}
