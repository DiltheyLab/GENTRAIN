import { AnalysisForm } from "@/modules/outbreak_analysis/components/settings/analysis_selection/AnalysisForm";
import { AnalysisSelection } from "@/modules/outbreak_analysis/components/settings/analysis_selection/AnalysisSelection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/core/components/ui/Card";
import { Separator } from "@/modules/core/components/ui/Separator";
import { Layout } from "@/modules/core/components/layout/Layout";

export const OutbreakAnalysisOverview = () => {
    console.log("OutbreakAnalysisSelection");

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
