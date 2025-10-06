import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import GentrainLogo from "@/assets/img/gentrain-logo.svg";
import { PartnerLogos } from "@/modules/core/components/layout/PartnerLogos";

export const MobileBlocker = () => {
    const isProd = import.meta.env.PROD;

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (!isProd) return;
        const checkSize = () => setIsMobile(window.innerWidth < 1000);
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    if (!isMobile || !isProd) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 text-center p-6 sm:p-8 md:p-10 overflow-y-auto">
            <div className="flex justify-center mb-8 sm:mb-10">
                <img src={GentrainLogo} alt="GENTRAIN NRW" className="w-48 sm:w-64 md:w-80 h-auto object-contain" />
            </div>

            <div className="flex flex-col items-center bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200/60 dark:border-gray-700/50">
                <AlertTriangle size={56} className="text-primary mb-4 sm:mb-6 flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl font-semibold mb-3">Nicht für mobile Geräte ausgelegt</h1>
                <p className="text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm">
                    Diese Anwendung ist für Desktop-Ansichten konzipiert. Bitte öffne sie auf einem größeren Bildschirm
                    (z. B. Laptop oder PC), um alle Funktionen nutzen zu können.
                </p>
            </div>

            <div className="mt-10 sm:mt-16 w-full max-w-xs sm:max-w-md">
                <PartnerLogos />
            </div>
        </div>
    );
};
