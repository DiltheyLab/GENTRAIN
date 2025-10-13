import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "../../stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { useTranslation } from "react-i18next";
import { renderHtmlFromTranslation } from "@/modules/core/helpers/translations";
import { ActionArea } from "./ActionArea";
import { Bot } from "lucide-react";

export function ImportAssistent() {
    const { t, i18n } = useTranslation();
    const [opened, setOpened] = useState(true);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const importAssistentStep = useDataManagementStore((state) => state.importAssistentStep);
    const resetImportAssistent = useDataManagementStore((state) => state.resetImportAssistent);

    const closeImportAssistent = () => {
        setOpened(!opened);
        resetImportAssistent();
    };

    return (
        <Dialog open={opened} onOpenChange={closeImportAssistent}>
            <DialogContent
                className="max-w-[1000px] w-[calc(100vw-50px)] max-h-[100vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center">
                            {importAssistentStep === "introduction" ? (
                                <>
                                    <Bot width={70} height={70} />
                                    <span className="text-[2rem] ml-4">
                                        {t(`import:titles.${importAssistentStep}`)}
                                    </span>
                                </>
                            ) : (
                                t(`import:titles.${importAssistentStep}`)
                            )}
                        </div>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                {i18n.exists(`import:${importAssistentStep}.shared`) &&
                    renderHtmlFromTranslation(`import:${importAssistentStep}.shared`)}
                {i18n.exists(`import:${importAssistentStep}.${activePathogen?.pathogen_type?.name}`) &&
                    renderHtmlFromTranslation(`import:${importAssistentStep}.${activePathogen?.pathogen_type?.name}`)}

                <ActionArea />
            </DialogContent>
        </Dialog>
    );
}
