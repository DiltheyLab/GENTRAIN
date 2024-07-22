import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataTableRowActions() {
    return (
        <Button variant="destructive" size="sm" onClick={() => console.log("To be implemented.")}>
            <Trash className="h-4 w-4" />
        </Button>
    );
}
