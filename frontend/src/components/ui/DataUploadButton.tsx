import { importDataFromJson } from "@/database/db";
import { useRef } from "react";
import { Label } from "./label";
import { Input } from "./input";

export const DataUploadButton = () => {
    const uploadFileRef = useRef<HTMLInputElement | null>(null);

    return (
        <>
            <input
                id="sequenceUpload"
                ref={uploadFileRef}
                type="file"
                className="hidden"
                accept="application/JSON"
                onChange={(evt) => {
                    /*                     if (evt.target.files) {
                        importDataFromJson(evt.target.files[0]);
                    } */
                }}
            />
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="sequenceUpload">Sequenzdaten hochladen</Label>
                <Input id="sequenceUpload" type="file" />
            </div>
        </>
    );
};
