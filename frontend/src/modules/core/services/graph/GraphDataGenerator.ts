import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { CustomLink, CustomNode } from "@/modules/core/types/graph";
import { GraphCaseCollector } from "./GraphCaseCollector";
import { Kruskal } from "./Kruskal";
import i18next from "i18next";
import { COLOR_FOR_GENETIC_DISTANCE_LINKS } from "@/modules/core/helpers/colors";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { ContactSchema } from "@/modules/core/models/contacts";
import { DistanceMatrixAssembly } from "@/modules/core/models/distance_matrices";
import { LinkColorMapGenerator } from "./LinkColorMapGenerator";
import { formatDate } from "@/modules/core/helpers/dates.ts";

export const CONTACT_LINK_VALUE = -1;

export class GraphDataGenerator {
    private nodes: CustomNode[] = [];
    private links: CustomLink[] = [];
    private allLinks: CustomLink[] = [];
    private distanceMatrixAssembly: DistanceMatrixAssembly;
    private settings: AnalysisSettings;
    private contacts: ContactSchema[];
    private graphCaseCollector: GraphCaseCollector;
    private graphCases: CaseWithRelationships[] = [];

    constructor(
        cases: CaseWithRelationships[],
        distanceMatrixAssembly: DistanceMatrixAssembly,
        contacts: ContactSchema[],
        settings: AnalysisSettings
    ) {
        this.distanceMatrixAssembly = distanceMatrixAssembly;
        this.settings = settings;
        this.contacts = contacts;
        this.graphCaseCollector = new GraphCaseCollector(cases, settings);
    }

    public getAllLinks = () => this.allLinks;

    public execute = async () => {
        this.graphCases = await this.graphCaseCollector.execute();

        // create all links for the genetic distance
        this.generateAllLinks();

        // create nodes for the minimum spanning tree
        this.generateCustomNodes();

        // create links for the minimum spanning tree
        const kruskal = new Kruskal(this.nodes, this.allLinks);
        this.links = kruskal.getMSTLinks();

        // create links for the contact tracing
        if (this.settings.showContactTracingLinks && this.contacts) {
            this.generateContactLinks();
        }

        return { nodes: this.nodes, links: this.links };
    };

    private generateAllLinks = () => {
        // the column loop starts with rowIndex + 1 to prevent looping over cases which are already treated
        // because of that rowIndex is stopping with graphCases.length - 1
        for (let rowIndex = 0; rowIndex < this.graphCases.length - 1; rowIndex++) {
            const rowCase = this.graphCases[rowIndex];

            for (let columnIndex = rowIndex + 1; columnIndex < this.graphCases.length; columnIndex++) {
                const columnCase = this.graphCases[columnIndex];
                const distance = this.distanceMatrixAssembly?.[rowCase.case_id]?.[columnCase.case_id];
                // exclude link from graph if distance was not yet calculated
                if (
                    !rowCase.sequence_analysis?.result ||
                    !columnCase.sequence_analysis?.result ||
                    distance === undefined
                )
                    continue;

                this.allLinks.push({
                    source: this.graphCases[rowIndex].id,
                    target: this.graphCases[columnIndex].id,
                    value: distance,
                    color: COLOR_FOR_GENETIC_DISTANCE_LINKS,
                    curvature: 0,
                    type: i18next.t("linkTypes.geneticDistance"),
                    context: "",
                });
            }
        }
    };

    private generateCustomNodes = () => {
        this.nodes = this.graphCases.map((caseData) => {
            return {
                id: caseData.id,
                caseData: caseData,
                cluster: caseData.outbreak ? caseData.outbreak.name : i18next.t("clusterTypes.noOutbreakAssigned"),
                registeredAt: formatDate(caseData.registered_at),
            } satisfies CustomNode;
        });
    };

    private generateContactLinks = () => {
        // create a array with the ids of the cases which are in the already filtered graphCases array
        const graphCasesIds = this.graphCases.map((caseData) => caseData.id);

        // create a color map for the contact types
        const colorMapGenerator = new LinkColorMapGenerator(this.contacts);
        const contactLinksColorMap = colorMapGenerator.createColorMapForContactLinks();

        const contactTracingLinks: CustomLink[] = [];
        // create link objects for contacts
        for (const contact of this.contacts) {
            // only add contact links if both contact cases are in the already filtered graphCases array
            if (graphCasesIds.includes(contact.case_id_1) && graphCasesIds.includes(contact.case_id_2)) {
                const link = {
                    source: contact.case_id_1,
                    target: contact.case_id_2,
                    value: CONTACT_LINK_VALUE,
                    color: contactLinksColorMap[contact.type],
                    type: contact.type,
                    context: contact.context,
                    curvature: 0,
                } satisfies CustomLink;
                contactTracingLinks.push(link);
            }
        }

        // add contact links to the already existing mst links
        this.links = this.links.concat(contactTracingLinks);

        // calculate curvatures for the links because now we have more than one link between two nodes
        this.createLinkCurvatures();
    };

    private createLinkCurvatures = () => {
        const linkMap = new Map<string, number>();

        for (let i = 0; i < this.links.length; i++) {
            const source = this.links[i].source;
            const target = this.links[i].target;

            // Create a unique key for each link pair
            const key = source < target ? `${source}-${target}` : `${target}-${source}`;

            // Increment the count for this link pair
            if (linkMap.has(key)) {
                linkMap.set(key, linkMap.get(key)! + 1);
            } else {
                linkMap.set(key, 1);
            }

            // Set the curvature based on the count of this link pair
            this.links[i].curvature = 0.2 * (linkMap.get(key)! - 1);
        }
    };
}
