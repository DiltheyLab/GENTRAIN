import { COLOR_FOR_CASES_WITHOUT_CLUSTERS } from "@/modules/core/helpers/colors/colorPalettes";
import { Button } from "@/modules/core/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/Popover";
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
    color: string;
    cluster: string;
    disabled: boolean;
    changeColor: (cluster: string, color: string) => void;
};

export const ColorPicker = ({ color, cluster, disabled, changeColor }: ColorPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    style={{ backgroundColor: `${disabled ? COLOR_FOR_CASES_WITHOUT_CLUSTERS : color}` }}
                    className={" h-5 w-5 p-0 hover:ring-2 ring-gray-300 disabled:opacity-100"}
                    disabled={disabled}
                />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <HexColorPicker color={color} onChange={(color) => changeColor(cluster, color)} />
            </PopoverContent>
        </Popover>
    );
};
