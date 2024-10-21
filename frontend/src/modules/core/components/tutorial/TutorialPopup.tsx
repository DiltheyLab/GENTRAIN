import { useCoreStore } from "../../stores/core";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/Card";

export const TutorialPopup = () => {
    const { step } = useCoreStore((state) => state.tutorial);
    const incrementTutorialSteps = useCoreStore((state) => state.incrementTutorialSteps);

    //idee: Man braucht eine generische Karte, die je nachdem in welchem Step man sich befindet unterschiedliche Informationen anzeigt
    // und an einer anderen Stelle im Screen auftaucht. -> Portal

    //ToDo: PopUp nur anzeigen wenn user zum ersten mal rein kommt, ansonsten nicht
    return (
        <Card className="absolute w-[350px] bg-white z-[200]">
            <CardHeader>
                <CardTitle>Einführungstutorial</CardTitle>
                <CardDescription>Erfahren Sie wie die Software funktioniert.</CardDescription>
            </CardHeader>
            <CardContent>
                <h1>Möchten Sie an einem Tutorial teilnehmen?</h1>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Abbrechen</Button>
                <Button onClick={() => incrementTutorialSteps()}>Starten</Button>
            </CardFooter>
            <p>{step}</p>
        </Card>
    );
};
