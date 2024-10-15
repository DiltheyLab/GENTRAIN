import { useEffect } from "react";
import { SampleUpload } from "./SampleUpload";
import { ContactUpload } from "./ContactUpload";
import { CaseUpload } from "./CaseUpload";
import { useDataManagementStore } from "../../stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
export function InitialUpload() {
    const initalUploadStep = useDataManagementStore((state) => state.initialUploadStep);
    const setInitialUploadStep = useDataManagementStore((state) => state.setInitialUploadStep);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    useEffect(() => {
        setInitialUploadStep("cases");
    }, []);

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {initalUploadStep === "cases" && "Falldaten"}
                        {initalUploadStep === "samples" && "Sequenzdaten"}
                        {initalUploadStep === "contacts" && "Kontaktdaten"} importieren
                    </h2>
                    <p className="text-muted-foreground">
                        {initalUploadStep === "cases" && (
                            <>
                                Laden Sie Falldaten zu {activePathogen?.name} hoch. Eine Datei-Vorlage können Sie{" "}
                                <a href="/upload_templates/MAGS/Falldaten.csv">hier</a> herunterladen.
                            </>
                        )}
                    </p>
                </div>
            </div>
            {initalUploadStep === "cases" && <CaseUpload />}
            {initalUploadStep === "samples" && <SampleUpload />}
            {initalUploadStep === "contacts" && <ContactUpload />}
        </>
    );
}
