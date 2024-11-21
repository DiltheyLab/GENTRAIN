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
import {Button} from "@/modules/core/components/ui/Button";
import {Input} from "@/modules/core/components/ui/Input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/modules/core/components/ui/Table";
import {CSSProperties, useEffect, useState} from "react";
import {cn} from "../../helpers/cn";

type DataTableProps = {
    data: any[];
    columns: ColumnDef<any>[];
    enableSearch?: boolean;
    filterPlaceholder?: string;
    pageSize?: number;
    filterFn?: ((row: any, _columnId: any, value: string, _addMeta: any) => boolean) | undefined;
    onRowClick?: (row?: Row<any>) => void;
    preselectRows?: boolean;
    selectionLabel?: string;
    onInit?: (table: TanStackTable<any>) => void;
    actions?: (table: TanStackTable<any>) => JSX.Element;
    className?: string;
    setRowStyle?: (row: any) => CSSProperties;
};

export const DataTable = ({
                              data,
                              columns,
                              enableSearch = true,
                              filterPlaceholder = "Daten durchsuchen...",
                              pageSize = 10,
                              filterFn = undefined,
                              onRowClick = () => {
                              },
                              preselectRows = false,
                              selectionLabel = "Einträgen",
                              onInit,
                              actions,
                              className,
                              setRowStyle = () => {
                                  return {}
                              }
                          }: DataTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [initializedRowSelection, setInitializedRowSelection] = useState(false);

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
        // preselect all rows if corresponding flag is set to true
        if (!initializedRowSelection && preselectRows && data.length > 0) {
            table.toggleAllRowsSelected();
            setInitializedRowSelection(true);
        }
    }, [data]);

    useEffect(() => {
        // execute passed onInit-method when component is mounted
        if (table && onInit) {
            onInit(table);
        }
    }, []);

    return (
        <div className={cn("w-full overflow-x-auto pl-2 -ml-2 pt-2 -mt-2", className)}>
            {(enableSearch || actions) && (
                <div className="pb-4 flex flex-wrap justify-between items-center gap-y-4">
                    {enableSearch && (
                        <Input
                            placeholder={filterPlaceholder}
                            value={(globalFilter as string) ?? ""}
                            onChange={(event) => {
                                setGlobalFilter(event.target.value);
                            }}
                            className="max-w-sm"
                        />
                    )}
                    {actions && <div className="flex flex-wrap">{actions(table)}</div>}
                </div>
            )}
            <div className="rounded-md border bg-white">
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
                            table.getRowModel().rows.map((row) => {
                                return <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick(row)}
                                    style={setRowStyle(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Es existieren noch keine Einträge.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} von {table.getFilteredRowModel().rows.length}{" "}
                    {selectionLabel} ausgewählt.
                </div>
                {(table.getCanPreviousPage() || table.getCanNextPage()) && (
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
                )}
            </div>
        </div>
    );
};
