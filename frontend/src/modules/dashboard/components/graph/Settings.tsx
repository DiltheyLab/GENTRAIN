import { ColorSelection } from "./ColorSelection";
import { OptionSwitches } from "./OptionSwitches";

export const DashboardSettings = () => {
    return (
        <form className="flex flex-col items-center w-full gap-4 bg-white">
            <fieldset className="flex flex-col rounded-lg border p-4 w-full">
                <div data-tutorial-tour-step="dashboard-settings">
                    <h1 className="text-xl font-semibold leading-none">Einstellungen</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Optionen zur Visualisierung von Fällen und Verbindungen.
                    </p>
                    <OptionSwitches />
                </div>
            </fieldset>
            <fieldset className="flex flex-col rounded-lg border p-4 w-full">
                <div data-tutorial-tour-step="dashboard-coloring">
                    <h1 className="text-xl font-semibold leading-none">Einfärbung</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Färben Sie den Graphen nach versch. Kriterien ein.
                    </p>
                    <ColorSelection />
                </div>
            </fieldset>
        </form>
    );
};
