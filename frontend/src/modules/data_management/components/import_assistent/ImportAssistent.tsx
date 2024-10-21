import { useEffect, useState } from "react";
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

export function ImportAssistent() {
    const { t, i18n } = useTranslation();
    const [opened, setOpened] = useState(true);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const initalUploadStep = useDataManagementStore((state) => state.initialUploadStep);
    const resetInitialUpload = useDataManagementStore((state) => state.resetInitialUpload);

    const closeInitialUpload = () => {
        setOpened(!opened);
        resetInitialUpload();
    };

    return (
        <Dialog open={opened} onOpenChange={closeInitialUpload}>
            <DialogContent
                className="max-w-[1000px] w-[calc(100vw-50px)]"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{t(`import:titles.${initalUploadStep}`)}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {i18n.exists(`import:${initalUploadStep}.shared`) &&
                    renderHtmlFromTranslation(`import:${initalUploadStep}.shared`)}
                {i18n.exists(`import:${initalUploadStep}.${activePathogen?.pathogen_type?.name}`) &&
                    renderHtmlFromTranslation(`import:${initalUploadStep}.${activePathogen?.pathogen_type?.name}`)}
                <ActionArea />
            </DialogContent>
        </Dialog>
    );
}
