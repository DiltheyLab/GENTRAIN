import { useState } from "react";

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
export function InitialUploadDialog() {
    const [opened, setOpened] = useState(true);
    const [step, setStep] = useState("cases");

    return (
        <Dialog open={opened} onOpenChange={() => setOpened(!opened)}>
            <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                <DialogHeader>
                    <DialogTitle>Ihr erster Datenimport</DialogTitle>
                    <DialogDescription>Test</DialogDescription>
                    {step === "cases" && <CaseUpload onSubmit={() => setStep("samples")} />}
                    {step === "samples" && <SampleUpload onSubmit={() => setStep("contacts")} />}
                    {step === "contacts" && <ContactUpload />}
                    <DialogFooter></DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
