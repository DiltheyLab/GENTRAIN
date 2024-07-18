import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { AnalysisForm } from "./AnalysisForm";
import { AnalysisSelection } from "./AnalysisSelection";

type AnalysisDialogProps = {
    isOpen: boolean;
    changeIsOpen: () => void;
};

export const AnalysisDialog = ({ isOpen, changeIsOpen }: AnalysisDialogProps) => {
    const navigate = useNavigate();

    return (
        <Dialog open={isOpen}>
            <DialogContent className="min-w-[50vw] p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="flex flex-row justify-between items-center">
                        Bitte legen sie eine neue Ausbruchsanalyse an oder wählen sie eine bestehende aus.
                        <DialogClose asChild>
                            <Button type="button" onClick={() => navigate("/data-upload")} variant="ghost">
                                <X size={15} />
                            </Button>
                        </DialogClose>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex justify-between space-x-8">
                    <AnalysisForm changeIsOpen={changeIsOpen} />
                    <Separator orientation="vertical" />
                    <AnalysisSelection changeIsOpen={changeIsOpen} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
