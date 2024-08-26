import { SectionHeader } from "../outbreakAnalysis/SectionHeader";
import { ColorSelection } from "./ColorSelection";

export const DashboardSettings = () => {
    return (
        <div className="relative flex-col items-center flex min-h-[80vh]">
            <form className="w-full">
                <fieldset className="flex flex-col gap-4 rounded-lg border p-4">
                    <div>
                        <SectionHeader
                            title="Einfärbung"
                            tooltipContent={<p>Färben sie die Knoten nach verschiedenen Kriterien ein</p>}
                        />
                        <ColorSelection />
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
