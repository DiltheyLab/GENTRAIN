import { Layout } from "@/components/layout/Layout";
import { AnalysisForm } from "@/components/outbreakAnalysis/AnalysisForm";
import { AnalysisSelection } from "@/components/outbreakAnalysis/AnalysisSelection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const OutbreakAnalysis = () => {
    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-185px)]">
                <Card className="w-1/2 flex flex-col justify-center h-60">
                    <CardHeader>
                        <CardTitle>Ausbruchsanalyse</CardTitle>
                        <CardDescription>
                            Bitte legen sie eine neue Ausbruchsanalyse an oder wählen sie eine bestehende aus.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row justify-between space-x-8 h-full">
                            <AnalysisForm />
                            <Separator orientation="vertical" />
                            <AnalysisSelection />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};
