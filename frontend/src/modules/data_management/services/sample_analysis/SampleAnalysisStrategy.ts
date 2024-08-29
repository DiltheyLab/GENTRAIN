import { Cookies } from "react-cookie";
import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { DataManagementState, useDataManagementStore } from "../../stores/dataManagement";
import { socket } from "@/modules/core/helpers/socket";

export abstract class SampleAnalysisStrategy {
    protected dataManagementState: DataManagementState;
    protected pathogen: PathogenWithRelationships;
    protected sampleData: { fastaId: string; sequence: string }[] | undefined;
    protected fastaIdsToAnalyse: string[] = [];

    abstract createSample(fastaId: string, sequenceLength: number, variantsResult: object): void;
    abstract getAndPersistVariantsForSamples(): void;

    constructor(pathogen: PathogenWithRelationships) {
        this.dataManagementState = useDataManagementStore.getState();
        this.pathogen = pathogen;
    }

    setSampleData = (sampleData: { fastaId: string; sequence: string }[]) => {
        this.sampleData = sampleData;
    };

    execute = async () => {
        if (!this.sampleData) {
            console.error("No sample data was provided. Run setSampleData(<sample_data>) first.");
            return;
        }
        await this.getAndPersistVariantsForSamples();
    };

    string_to_slug(str: string) {
        str = str.replace(/^\s+|\s+$/g, ""); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to = "aaaaeeeeiiiioooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
        }

        str = str
            .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
            .replace(/\s+/g, "-") // collapse whitespace and replace by -
            .replace(/-+/g, "-"); // collapse dashes

        return str;
    }

    delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    getAndPersistVariantsForSample = async ({ fastaId, sequence }: { fastaId: string; sequence: string }) => {
        const cookies = new Cookies();
        socket.emit(
            "sample_analysis",
            cookies.get("gentrain_room"),
            this.string_to_slug(this.pathogen.name),
            fastaId,
            sequence
        );
    };
}
