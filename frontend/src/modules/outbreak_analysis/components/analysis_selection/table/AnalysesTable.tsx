import {
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/modules/core/components/ui/Button";
import { Input } from "@/modules/core/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { useState } from "react";
import { columns } from "@/modules/outbreak_analysis/components/analysis_selection/table/analysesTableColumns";
import { AnalysisCreation } from "../AnalysisCreation";
import { customFilterFn } from "@/modules/outbreak_analysis/helpers/analysesTableFilter";

export function AnalysesTable({ data }: { data: AnalysisSchema[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: customFilterFn,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
    });

    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center">
                    <Input
                        placeholder="Analysen filtern..."
                        value={(globalFilter as string) ?? ""}
                        onChange={(event) => {
                            setGlobalFilter(event.target.value);
                        }}
                        className="max-w-sm"
                    />
                </div>
                <AnalysisCreation />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Es existieren noch keine Analysen.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} von {table.getFilteredRowModel().rows.length}{" "}
                    Spalte(n) ausgewählt.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Vorherige
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Nächste
                    </Button>
                </div>
            </div>
        </div>
    );
}
