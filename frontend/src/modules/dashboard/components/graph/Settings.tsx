import { ColorSelection } from "./ColorSelection";

export const DashboardSettings = () => {
    return (
        <form className="flex flex-col items-center w-full">
            <fieldset className="flex flex-col gap-4 rounded-lg border p-4">
                <div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold leading-none">Einfärbung</h1>
                        <p className="text-sm text-muted-foreground mb-2 mt-1">
                            Färben Sie den Graphen nach verschiedenen Kriterien ein.
                        </p>
                    </div>
                    <ColorSelection />
                </div>
            </fieldset>
        </form>
    );
};
