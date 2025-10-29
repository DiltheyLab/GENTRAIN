import { Button } from "@/modules/core/components/ui/Button";
import { Upload } from "lucide-react";
import { importDataFromJson } from "@/modules/core/helpers/database";
import { useState } from "react";
import { useToast } from "./UseToast";
import { LoadingSpinner } from "./LoadingSpinner";

export const ImportIndexedDbBtn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsLoading(true);

        try {
            await importDataFromJson(file);
            toast({
                title: "Import erfolgreich",
                description: "Der Zustand wurde erfolgreich importiert.",
                variant: "success",
                duration: 5000,
            });
        } catch (error) {
            toast({
                title: "Import fehlgeschlagen",
                description: "Beim Importieren des Zustands ist ein Fehler aufgetreten.",
                variant: "destructive",
                duration: 5000,
            });
            console.error("Error importing database:", error);
        } finally {
            setIsLoading(false);
            event.target.value = "";
        }
    };

    return (
        <label htmlFor="dexie-file-upload">
            <input
                id="dexie-file-upload"
                type="file"
                className="hidden"
                accept=".json,application/json"
                onChange={handleInputChange}
            />
            <Button
                asChild
                variant="outline"
                className="gap-2 flex items-center cursor-pointer"
                title="Zustand importieren"
            >
                <span>
                    <span className="hidden lg:inline">Zustand importieren</span>
                    {isLoading ? <LoadingSpinner /> : <Upload className="h-5 w-5 inline-block" />}
                </span>
            </Button>
        </label>
    );
};
