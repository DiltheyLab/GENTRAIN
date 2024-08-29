import EuropeanUnionBanner from "@/assets/img/DE_Finanziert_von_der_Europaeischen_Union_POS.png";
import UKDLogo from "@/assets/img/ukd_logo.png";
import BielefeldMedLogo from "@/assets/img/bielefeld_med.png";
import { Separator } from "@/modules/core/components/ui/Separator";

export const PartnerLogos = () => {
    return (
        <div className="flex items-center justify-evenly relative">
            <div className="flex items-center justify-evenly relative">
                <div className="mx-4">
                    <img style={{ width: 150, height: "auto" }} src={UKDLogo} />
                </div>
                <div className="mx-4">
                    <img style={{ width: 120, height: "auto" }} src={BielefeldMedLogo} />
                </div>
                <Separator orientation="vertical" className="h-[60px]" />
                <div className="mx-4">
                    <img style={{ width: 200, height: "auto" }} src={EuropeanUnionBanner} />
                </div>
            </div>
        </div>
    );
};
