import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../ui/label";
import { StepIndicator } from "../ui/step-indicator";
import { CustomTooltip } from "../ui/customTooltip";
import { Info } from "lucide-react";
import { Switch } from "../ui/switch";
import { ColorPicker } from "./ColorPicker";
import { CustomNode } from "@/types/graph";
import { COLORPALETTEGRADATIONS } from "@/colors/colorPalettes";
import { getUniqueClustersOfNodes } from "@/services/graphs";

export const ColorSelection = () => {
    const analysisStore = useAnalysisStore();
    const currentColorPalette = analysisStore.settings.colorPaletteNodes;
    //const [customColorPalette, setCustomColorPalette] = useState<string[]>(analysisStore.settings.colorPaletteNodes);

    const changeColor = (cluster: string, newColor: string) => {
        console.log(cluster);
        // anstatt array aus farben eine colorpalette erstellen und diese beim Coloring mit keys von den cluster bestücken
        // dann kann hier mit dem cluster darauf zugegriffen werden
        // vll vorher testen ob man die similierung des graphen ignorieren kann
        // dafür als beispiel einfach die settings updaten und testen
        // falls nicht die colorierung in den graphen verlagern (siehe kommentar dort)
        const customColorPalette = {
            Abschiedsparty: "#000FF0",
            //...
        };

        analysisStore.updateSettings({ colorPaletteNodes: COLORPALETTEGRADATIONS });
    };

    const renderItems = (node: CustomNode) => {
        return (
            <div className="flex flex-row items-center gap-3" key={node.cluster}>
                <Switch id={node.cluster} defaultChecked={true} />
                <Label htmlFor={node.cluster} className="font-normal text-md">
                    {node.cluster}
                </Label>
                <ColorPicker nodeColor={node.color} cluster={node.cluster} changeColor={changeColor} />
            </div>
        );
    };

    const renderOutbreakColoring = () => {
        if (!analysisStore.graphData.nodes) return;
        const clustersOfNodes = getUniqueClustersOfNodes(analysisStore.graphData.nodes);
        const selectedOutbreak = clustersOfNodes.filter(
            (nodes) => nodes.cluster === analysisStore.settings.selectedOutbreak?.name
        );
        const selectectedBackgrounds = clustersOfNodes.filter(
            (nodes) => nodes.cluster !== analysisStore.settings.selectedOutbreak?.name
        );
        return (
            <>
                <Label>Selektierter Ausbruch umfärben</Label>
                {selectedOutbreak.map((node) => renderItems(node))}
                <Label>Background umfärben</Label>
                {selectectedBackgrounds.map((node) => renderItems(node))}
            </>
        );
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
                <Label className="flex items-center font-bold text-md mr-3">
                    <StepIndicator>5</StepIndicator>Einfärbung
                </Label>
                <CustomTooltip
                    trigger={<Info className="h-5 w-5 cursor-pointer" />}
                    content={<p>Sie können hier Einstellungen an der Farbe vornehmen.</p>}
                />
            </div>
            {renderOutbreakColoring()}
            <Label>Nach Zeitspanne umfärben</Label>

            <div className="flex flex-row items-center gap-3">
                <Switch id="showBackground" />
                <Label htmlFor="showBackground" className="font-normal text-md">
                    Registrierungsdatum
                </Label>
            </div>
        </div>
    );
};
