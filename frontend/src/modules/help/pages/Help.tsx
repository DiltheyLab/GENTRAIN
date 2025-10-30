import { Tutorial } from "@/modules/help/components/Tutorial";
import { Documentation } from "@/modules/help/components/Documentation";
import { Intro } from "@/modules/help/components/Intro";
import { Separator } from "@/modules/core/components/ui/Separator";

export function Help() {
    return (
        <div className="flex flex-1 flex-col space-y-9 p-8">
            <Intro />
            <Separator />
            <Documentation />
            <Separator />
            <Tutorial />
        </div>
    );
}
