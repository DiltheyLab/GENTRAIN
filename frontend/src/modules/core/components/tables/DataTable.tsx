import {
    ColumnDef,
    Row,
    SortingState,
    Table as TanStackTable,
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
import { useEffect, useState } from "react";

export function DataTable({
    data,
    columns,
    enableFilter = true,
    pageSize = 10,
    filterFn = undefined,
    onRowClick = () => {},
    preselectRows = false,
    onInit,
    actions,
}: {
    data: any[];
    columns: ColumnDef<any>[];
    enableFilter?: boolean;
    pageSize?: number;
    filterFn?: ((row: any, _columnId: any, value: string, _addMeta: any) => boolean) | undefined;
    onRowClick?: (row?: Row<any>) => void;
    preselectRows?: boolean;
    onInit?: (table: TanStackTable<any>) => void;
    actions?: (table: TanStackTable<any>) => JSX.Element;
}) {
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
        globalFilterFn: filterFn,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        autoResetPageIndex: false,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });

    useEffect(() => {
        if (preselectRows) {
            table.toggleAllRowsSelected();
        }
        if (table && onInit) {
            onInit(table);
        }
    }, []);

    return (
        <div className="w-full overflow-x-scroll p-2">
            {enableFilter && (
                <div className="pb-4 flex flex-wrap justify-between items-center gap-y-4">
                    <Input
                        placeholder="Daten filtern..."
                        value={(globalFilter as string) ?? ""}
                        onChange={(event) => {
                            setGlobalFilter(event.target.value);
                        }}
                        className="max-w-sm"
                    />
                    <div className="flex flex-wrap">{actions !== undefined && actions(table)}</div>
                </div>
            )}

            <div className="rounded-md border">
                <Table className="w-full">
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick(row)}
                                >
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
                                    Es existieren noch keine Falldaten.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {(table.getCanPreviousPage() || table.getCanNextPage()) && (
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
            )}
        </div>
    );
}
