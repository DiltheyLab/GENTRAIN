import { Row } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    return (
        <Button variant="destructive" size="sm" onClick={() => row.delete()}>
            <Trash className="h-4 w-4" />
        </Button>
    );
}
