"use client";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { PathogenSchema, usePathogensGetAll } from "@/database/pathogens";
import { useApp } from "@/providers/AppProvider";

export function PathogenSwitch() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const pathogens = usePathogensGetAll();
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
                {pathogens?.map((pathogen: PathogenSchema) => {
                    return (
                        <div
                            className="px-4 py-2 cursor-pointer hover:bg-muted"
                            key={pathogen.name}
                            onClick={() => {
                                appContext?.updatePathogen(pathogen);
                                setOpen(false);
                            }}
                        >
                            {pathogen.name}
                        </div>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}
