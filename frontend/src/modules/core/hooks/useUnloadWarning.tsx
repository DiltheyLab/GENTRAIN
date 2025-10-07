import { useEffect } from "react";
import { db } from "../services/database/DatabaseManager";

export function useUnloadWarning(message = "Alle Daten gehen verloren, wenn Sie das Fenster schließen!") {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            // returnValue ist offiziell deprecated, wird aber weiterhin von Browsern genutzt
            event.returnValue = message;
            db.delete({ disableAutoOpen: false });
            return message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [message]);
}
