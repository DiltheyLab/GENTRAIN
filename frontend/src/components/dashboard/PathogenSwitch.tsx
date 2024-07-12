import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useApp } from "@/providers/AppProvider";
import { PathogenTypeSchema, usePathogenTypesGetAll } from "@/database/pathogen_types";
import { PathogenSchema, usePathogensGetAll } from "@/database/pathogens";

export function PathogenSwitch() {
    const [open, setOpen] = useState(false);
    const pathogens = usePathogensGetAll();
    const pathogenTypes = usePathogenTypesGetAll();
    const appContext = useApp();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {appContext?.pathogen ? appContext?.pathogen?.name : "Pathogen auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                {pathogenTypes?.map((pathogenType: PathogenTypeSchema) => {
                    return (
                        <div key={pathogenType.name}>
                            <div className="text-sm font-bold px-4 py-2r">{pathogenType.name}</div>
                            {pathogens?.map((pathogen: PathogenSchema) => {
                                if (pathogen.pathogen_type_id !== pathogenType.id) {
                                    return;
                                }
                                return (
                                    <div
                                        key={pathogen.name}
                                        className="text-sm font-medium px-4 py-2 cursor-pointer hover:bg-muted"
                                        onClick={() => {
                                            setOpen(false);
                                            appContext?.updatePathogen(pathogen);
                                        }}
                                    >
                                        {pathogen.name}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}
