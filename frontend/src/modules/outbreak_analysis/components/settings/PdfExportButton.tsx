import { Button } from "@/modules/core/components/ui/Button";
import { exportGraphAndInformationAsPdf } from "../../helpers/pdf";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";

const PdfExportButton = () => {
    const analysisName = useOutbreakAnalysisStore((state) => state.name);
    return (
        <Button
            className="mt-2"
            variant="outline"
            type="button"
            onClick={() => exportGraphAndInformationAsPdf(analysisName)}
        >
            Analysebericht exportieren
        </Button>
    );
};

export default PdfExportButton;
