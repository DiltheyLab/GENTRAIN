import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";
import { Button } from "./Button";
import { Label } from "./Label";

export function PathogenDialog() {
    const initSession = useCoreStore((state) => state.initSession);

    const handleClick = () => {
        initSession();
    };

    return (
        <>
            <h1> Willkommen bei Gentrain!</h1>
            <Label>Pathogen auswählen</Label>
            <p>Für welches Pathogen möchten sie Ausbruchanalysen durchführen?</p>
            <PathogenSwitch />
            <Button onClick={() => handleClick()}>Weiter</Button>
        </>
    );
}
