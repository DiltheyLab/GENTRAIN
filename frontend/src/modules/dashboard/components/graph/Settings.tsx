import { ColorSelection } from "./ColorSelection";

export const DashboardSettings = () => {
    return (
        <div className="flex-col items-center flex">
            <form className="w-full">
                <fieldset className="flex flex-col gap-4 rounded-lg border p-4">
                    <div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-semibold leading-none tracking-tight">Einfärbung</h1>
                            <p className="text-sm text-muted-foreground mb-2 mt-1">
                                Färben Sie den Graphen nach verschiedenen Kriterien ein.
                            </p>
                        </div>
                        <ColorSelection />
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
