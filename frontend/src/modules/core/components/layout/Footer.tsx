import { PartnerLogos } from "@/modules/core/components/layout/PartnerLogos";
import { useCoreStore } from "../../stores/core";

export const Footer = () => {
    const sessionId = useCoreStore((state) => state.sessionId);

    return (
        <footer className="mt-[40px] bg-accent">
            <div className="flex justify-between items-center px-4 py-4 max-w-[1500px] mx-auto text-sm min-h-[80px]">
                <div>
                    <div>
                        Made with <span className="text-primary">&#9829;</span> in Düsseldorf by&nbsp;
                        <a href="https://www.medmikrobio.hhu.de/ag-dilthey" className="font-bold" target="_blank">
                            DiltheyLab
                        </a>
                    </div>
                    <small>© 2025 Universitätsklinikum Düsseldorf</small>
                    <div className="mt-2">
                        <a href="/contact" className="underline">
                            Kontakt
                        </a>
                        <a href="/data-privacy" className="underline ml-4">
                            Datenschutz
                        </a>
                        <a href="/impress" className="underline ml-4">
                            Impressum
                        </a>
                        <p className="mt-3"> Session ID: {sessionId}</p>
                    </div>
                </div>
                <div className="flex items-center justify-evenly relative">
                    <PartnerLogos />
                </div>
            </div>
        </footer>
    );
};
