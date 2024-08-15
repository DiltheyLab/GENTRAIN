import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

type ColorPickerProps = {
    nodeColor: string;
    cluster: string;
    changeColor: (cluster: string, color: string) => void;
};

export const ColorPicker = ({ nodeColor, cluster, changeColor }: ColorPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    style={{ backgroundColor: `${nodeColor}` }}
                    className={" h-5 w-5 p-0 hover:ring-2 ring-gray-300"}
                />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <HexColorPicker color={nodeColor} onChange={(color) => changeColor(cluster, color)} />
            </PopoverContent>
        </Popover>
    );
};
