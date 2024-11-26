import { Sheet, SheetContent, SheetTrigger } from "@/modules/core/components/ui/Sheet";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/modules/core/components/ui/Button";
import { Menu, Package2, Save, Share2, Upload } from "lucide-react";
import { exportDatabaseToJson, importDataFromJson } from "@/modules/core/helpers/database";
import { useRef } from "react";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";

export const Header = () => {
    const uploadFileRef = useRef<HTMLInputElement | null>(null);
    const pathName = useLocation().pathname.split("/")[1];

    /*     const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useCoreStore((state) => state.changeTutorialIsRunning); */

    const isSelected = (url: string) => {
        return pathName === url ? "text-foreground" : "text-muted-foreground";
    };

    return (
        <header className="sticky top-0 flex min-h-[65px] items-center gap-4 border-b bg-background z-[49] px-4 md:px-6">
            <nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link to="/" className="flex items-center gap-2 text-md md:text-base gentrain-logo">
                    <Share2 className="h-6 w-6 text-primary" />
                    <div className="not-sr-only text-primary text-3xl font-extrabold uppercase">Gentrain</div>
                </Link>
                <Link
                    data-tutorial-tour-step="dashboard-nav"
                    to="/"
                    className={`${isSelected("")} transition-colors hover:text-foreground text-md`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/outbreak-analysis"
                    data-tutorial-tour-step="outbreak-analysis-overview-nav"
                    className={`${isSelected("outbreak-analysis")} transition-colors hover:text-foreground text-md`}
                >
                    Ausbruchsanalyse
                </Link>
                <Link
                    to="/data-management"
                    className={`${isSelected("data-management")} transition-colors hover:text-foreground text-md`}
                    data-tutorial-tour-step="data-management-nav"
                >
                    Datenverwaltung
                </Link>
                {/*  <Button
                    onClick={() => {
                        changeTutorialIsRunning(true);
                        changeTutorialTourIsActive(true);
                    }}
                    className="absolute"
                >
                    Tutorial
                </Button> */}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Gentrain</span>
                        </Link>
                        <Link to="/" className={`${isSelected("/")} transition-colors hover:text-foreground`}>
                            Dashboard
                        </Link>
                        <Link
                            to="/outbreak-analysis"
                            className={`${isSelected("/outbreak-analysis")} transition-colors hover:text-foreground`}
                        >
                            Ausbruchsanalyse
                        </Link>
                        <Link
                            to="/data-management"
                            className={`${isSelected("/data-management")} transition-colors hover:text-foreground`}
                        >
                            Daten
                        </Link>
                        <Link to="#" className="text-muted-foreground hover:text-foreground">
                            Hilfe/FAQ
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex items-center gap-4 ml-auto md:gap-2 lg:gap-4">
                <input
                    id="dexie-file-upload"
                    ref={uploadFileRef}
                    type="file"
                    className="hidden"
                    accept="application/JSON"
                    onChange={(evt) => {
                        if (evt.target.files) {
                            importDataFromJson(evt.target.files[0]);
                        }
                    }}
                />
                <div className="flex flex-row gap-4">
                    <div className="flex flex-row gap-4" data-tutorial-tour-step="dashboard-state-import">
                        <label htmlFor="dexie-file-upload">
                            <Button
                                variant="outline"
                                className="gap-2 flex items-center"
                                onClick={async (evt) => {
                                    evt.preventDefault();
                                    if (uploadFileRef?.current) uploadFileRef?.current.click();
                                }}
                                title="Zustand importieren"
                            >
                                <span className="hidden sm:block md:hidden lg:hidden xl:block">
                                    Zustand importieren
                                </span>
                                <Upload className="h-5 w-5" />
                            </Button>
                        </label>
                        <Button
                            variant="outline"
                            className="gap-2 flex items-center"
                            onClick={() => exportDatabaseToJson()}
                            title="Zustand speichern"
                        >
                            <span className="hidden sm:block md:hidden lg:hidden xl:block">Zustand speichern</span>
                            <Save className="h-5 w-5" />
                        </Button>
                    </div>
                    <div data-tutorial-tour-step="dashboard-pathogen-switch">
                        <PathogenSwitch />
                    </div>
                </div>
            </div>
        </header>
    );
};
