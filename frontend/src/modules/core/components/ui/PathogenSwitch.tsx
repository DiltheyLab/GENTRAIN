import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/modules/core/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/Popover";
import { useState } from "react";
import { useGetAllPathogenTypesWithPathogens } from "@/modules/core/hooks/database/pathogen_types/useGetAllPathogenTypes";
import { useTranslation } from "react-i18next";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeWithRelationships } from "@/modules/core/models/pathogen_types";
import { cn } from "../../helpers/cn";

type PathogenSwitchProps = {
    className?: string;
};
export const PathogenSwitch = ({ className }: PathogenSwitchProps) => {
    const [open, setOpen] = useState(false);
    const pathogenTypes = useGetAllPathogenTypesWithPathogens();
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const { t } = useTranslation();
    const renderPathogenOptionsForPathogenType = (pathogenType: PathogenTypeWithRelationships) => {
        if (pathogenType.pathogens?.length === 0) {
            return null;
        }
        return (
            <div key={pathogenType.name}>
                <div className="text-xs font-bold px-4 py-2">{t(`pathogen_type.${pathogenType.name}`)}</div>
                {pathogenType.pathogens?.map((pathogen) => {
                    if (pathogen.pathogen_type_id !== pathogenType.id) {
                        return;
                    }
                    return (
                        <div
                            key={pathogen.name}
                            className="text-sm font-light px-4 py-2 cursor-pointer hover:bg-muted"
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
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    {activePathogen ? activePathogen.name : "Pathogen auswählen"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-[200px] px-0 py-2", className)}>
                {pathogenTypes?.map((pathogenType) => renderPathogenOptionsForPathogenType(pathogenType))}
            </PopoverContent>
        </Popover>
    );
};
