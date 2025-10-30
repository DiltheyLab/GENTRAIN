import { Link, useLocation } from "react-router-dom";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";
import GentrainLogo from "@/assets/img/gentrain-logo.svg";
import { SaveIndexedDbBtn } from "../ui/SaveIndexedDbBtn";
import { ImportIndexedDbBtn } from "../ui/ImportIndexedDbBtn";

export const Header = () => {
    const pathName = useLocation().pathname.split("/")[1];
    const isSelected = (url: string) => {
        return pathName === url ? "text-foreground" : "text-muted-foreground";
    };

    return (
        <header className="sticky top-0 flex min-h-[65px] items-center gap-4 border-b bg-background z-[49] px-4 md:px-6">
            <nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link to="/" className="flex items-center gap-2 text-md md:text-base gentrain-logo">
                    <div className="not-sr-only text-primary text-3xl font-extrabold uppercase">
                        <img width={200} src={GentrainLogo} alt="GENTRAIN NRW" />
                    </div>
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
                <Link to="/help" className={`${isSelected("help")} transition-colors hover:text-foreground text-md`}>
                    Hilfe
                </Link>
            </nav>

            <div className="flex items-center gap-4 ml-auto md:gap-2 lg:gap-4">
                <div className="flex flex-row gap-4" data-tutorial-tour-step="dashboard-state-import">
                    <ImportIndexedDbBtn />
                    <SaveIndexedDbBtn />
                </div>
                <div data-tutorial-tour-step="dashboard-pathogen-switch">
                    <PathogenSwitch />
                </div>
            </div>
        </header>
    );
};
