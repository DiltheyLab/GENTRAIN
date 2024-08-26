import { Separator } from "../ui/separator";
import { AnalysisForm } from "./AnalysisForm";
import { AnalysisSelection } from "./AnalysisSelection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const AnalysisDialog = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ausbruchsanalyse</CardTitle>
                <CardDescription>
                    Bitte legen sie eine neue Ausbruchsanalyse an oder wählen sie eine bestehende aus.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between space-x-8">
                    <AnalysisForm />
                    <Separator orientation="vertical" />
                    <AnalysisSelection />
                </div>
            </CardContent>
        </Card>
    );
};
