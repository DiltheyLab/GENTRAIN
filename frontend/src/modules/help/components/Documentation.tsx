import { Button } from "@/modules/core/components/ui/Button";
import { Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import userManual from "@/assets/files/Nutzungshandbuch.pdf";

export const Documentation = () => {
    return (
        <div>
            <div className="mb-4 flex items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dokumentation</h1>
                    <p className="text-muted-foreground">
                        Hier finden Sie die offizielle Dokumentation zur Nutzung der Anwendung. Sie enthält Anleitungen,
                        Erklärungen zu den Funktionen und weitere hilfreiche Informationen.
                    </p>
                </div>
            </div>
            <div className="flex space-x-3">
                <Link to="https://docs.gentrain.bi.denbi.de" target="_blank" rel="noreferrer">
                    <Button variant="primary">
                        Zur GENTRAIN Dokumentation <ExternalLink className="ml-2" size={20} />
                    </Button>
                </Link>
                <a href={userManual} download className="inline-block text-black">
                    <Button variant="outline">
                        Nutzungshandbuch herunterladen <Download className="ml-2" size={20} />
                    </Button>
                </a>
            </div>
        </div>
    );
};
