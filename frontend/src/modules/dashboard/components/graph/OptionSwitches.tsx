import { Label } from "@/modules/core/components/ui/Label";
import { Switch } from "@/modules/core/components/ui/Switch";
import { useDashboardStore } from "../../stores/dashboard";

export const OptionSwitches = () => {
    const showContactTracingLinks = useDashboardStore((state) => state.settings.showContactTracingLinks);
    const excludeCasesWithoutSequence = useDashboardStore((state) => state.settings.excludeCasesWithoutSequence);
    const updateSettings = useDashboardStore((state) => state.updateSettings);

    return (
        <>
            <div className="flex flex-row items-center gap-3 mt-3">
                <Switch
                    id="excludeCasesWithoutSequence"
                    checked={!excludeCasesWithoutSequence}
                    onCheckedChange={(value) => updateSettings({ excludeCasesWithoutSequence: !value })}
                />
                <Label htmlFor="excludeCasesWithoutSequence" className="text-md leading-5">
                    Fälle ohne Sequenzen anzeigen
                </Label>
            </div>
            <div className="flex flex-row items-center gap-3 mt-2">
                <Switch
                    id="showContactTracingLinks"
                    checked={showContactTracingLinks}
                    onCheckedChange={(value) => updateSettings({ showContactTracingLinks: value })}
                />
                <Label htmlFor="showContactTracingLinks" className="text-md">
                    Kontaktkanten anzeigen
                </Label>
            </div>
        </>
    );
};
