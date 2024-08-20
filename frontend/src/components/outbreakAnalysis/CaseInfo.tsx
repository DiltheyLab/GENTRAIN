import { Button } from "../ui/button";
import { X } from "lucide-react";
import { CaseWithRelationships } from "@/database/cases";

type CaseInfoProps = {
    selectedCase: CaseWithRelationships | null;
    updateSelectedCase: (selectedCase: CaseWithRelationships | null) => void;
};

export const CaseInfo = ({ selectedCase, updateSelectedCase }: CaseInfoProps) => {
    if (!selectedCase) return;

    return (
        <fieldset className="absolute z-10 right-2 bottom-0 rounded-lg w-fit border p-4 bg-muted ">
            <legend className="-ml-1 px-1 text-sm font-medium">Informationen</legend>
            <Button
                className="absolute -top-[17px] right-1 hover:bg-inherit hover:text-primary bg-inherit rounded-full h-4 -px-1"
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => updateSelectedCase(null)}
            >
                <X size={23} className="text-slate-700" />
            </Button>
            <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-3">
                    <label htmlFor="nodeLabel" className="text-sm font-normal leading-none">
                        Fall ID:
                    </label>
                    <p>{selectedCase.case_id}</p>
                </div>
            </div>
        </fieldset>
    );
};
