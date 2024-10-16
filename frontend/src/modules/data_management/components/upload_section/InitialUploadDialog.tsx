import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { SampleUpload } from "./SampleUpload";
import { ContactUpload } from "./ContactUpload";
import { CaseUpload } from "./CaseUpload";
import { useDataManagementStore } from "../../stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
export function InitialUploadDialog() {
    const [opened, setOpened] = useState(true);
    const initalUploadStep = useDataManagementStore((state) => state.initialUploadStep);
    const setInitialUploadStep = useDataManagementStore((state) => state.setInitialUploadStep);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    useEffect(() => {
        setInitialUploadStep("cases");
    }, []);

    return (
        <Dialog open={opened} onOpenChange={() => setOpened(!opened)}>
            <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                <DialogHeader>
                    <DialogTitle>
                        <h2 className="text-2xl font-bold tracking-tight">Ihr erster Datenupload</h2>
                    </DialogTitle>
                    <DialogDescription>
                        {initalUploadStep === "cases" && (
                            <>
                                <p className="text-md">
                                    Zunächst werden Falldaten benötigt, auf deren Basis anschließend Ausbruchsanalysen
                                    durchgeführt werden können. Zu jedem Fall können im Anschluss außerdem Sequenzen und
                                    Kontakte hinzugefügt werden, die eine genomisch als auch kontaktbasierte gestütze
                                    Infektionskettennachverfolgung.
                                </p>
                                <p className="text-md mt-2">
                                    Eine entsprechende Datei-Vorlage können Sie{" "}
                                    <a href="/upload_templates/MAGS/Falldaten.csv">hier</a> herunterladen.
                                </p>
                            </>
                        )}
                        {initalUploadStep === "samples" && (
                            <>
                                <p className="text-md">
                                    Sie haben nun die Möglichkeit Sequenzdaten zu den zuvor von Ihnen hinzugefügten
                                    Fällen zu hinterlegen. Nicht jeder Fall benötigt eine genetische Sequenz, allerdings
                                    ermöglicht eine hohes Sequenzvorkommen präziesere Schlüsse in der Ausbruchsanalyse.
                                </p>
                                <p className="text-md mt-2">
                                    Eine entsprechende Datei-Vorlage können Sie{" "}
                                    <a href="/upload_templates/MAGS/Falldaten.csv">hier</a> herunterladen.
                                </p>
                            </>
                        )}
                        {initalUploadStep === "contacts" && (
                            <>
                                <p className="text-md">Lorem ipsum</p>
                                <p className="text-md mt-2">
                                    Eine entsprechende Datei-Vorlage können Sie{" "}
                                    <a href="/upload_templates/MAGS/Falldaten.csv">hier</a> herunterladen.
                                </p>
                            </>
                        )}
                    </DialogDescription>

                    <p className="text-muted-foreground"></p>
                    {initalUploadStep === "cases" && <CaseUpload />}
                    {initalUploadStep === "samples" && <SampleUpload />}
                    {initalUploadStep === "contacts" && <ContactUpload />}
                    <DialogFooter></DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
