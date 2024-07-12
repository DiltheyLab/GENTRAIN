import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { PathogenTypeSchema } from "@/database/pathogen_types";
import { PathogenSchema, usePathogensGetAll } from "@/database/pathogens";
import { useAppStore } from "@/stores/app";
import { useGetAllPathogenTypes } from "@/hooks/database/pathogen_types/useGetAllPathogenTypes";
import { useTranslation } from "react-i18next";

export function PathogenSwitch() {
    const [open, setOpen] = useState(false);
    const pathogens = usePathogensGetAll();
    const pathogenTypes = useGetAllPathogenTypes();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const updateActivePathogen = useAppStore((state) => state.updateActivePathogen);
    const { t } = useTranslation();

    useEffect(() => {
        const activelyPersistedPathogen = pathogens?.find((pathogen: PathogenSchema) => pathogen.activated_at);
        if (activelyPersistedPathogen) {
            updateActivePathogen(activelyPersistedPathogen);
        }
    }, [pathogens]);

    const renderPathogenOptionsForPathogenType = (pathogenType: PathogenTypeSchema) => {
        return (
            <div key={pathogenType.name}>
                <div className="text-xs font-bold px-4 py-2r">{t(`pathogen_type.${pathogenType.name}`)}</div>
                {pathogens?.map((pathogen) => {
                    if (pathogen.pathogen_type_id !== pathogenType.id) {
                        return;
                    }
                    return (
                        <div
                            key={pathogen.name}
                            className="text-sm font-medium px-4 py-2 cursor-pointer hover:bg-muted"
                            onClick={() => {
                                setOpen(false);
                                updateActivePathogen(pathogen);
                            }}
                        >
                            {pathogen.name}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {activePathogen ? activePathogen.name : "Pathogen auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] px-0 py-2">
                {pathogenTypes?.map((pathogenType) => renderPathogenOptionsForPathogenType(pathogenType))}
            </PopoverContent>
        </Popover>
    );
}
