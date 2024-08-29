import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { ContactLinksColorMap, CustomLink, CustomNode, Link } from "@/modules/core/types/graph";
import { GraphCaseCollector } from "./GraphCaseCollector";
import { Kruskal } from "./Kruskal";
import i18next from "i18next";
import { createColor } from "@/modules/core/helpers/graphs";
import { COLOR_FOR_GENETIC_DISTANCE_LINKS, COLOR_PALETTE_LINKS } from "@/modules/core/helpers/colors";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { ContactSchema } from "@/modules/core/models/contacts";
import { DistanceMatrixAssembly } from "@/modules/core/models/distance_matrices";

export class GraphDataGenerator {
    private nodes: CustomNode[] = [];
    private links: CustomLink[] = [];
    private distanceMatrixAssembly: DistanceMatrixAssembly;
    private settings: AnalysisSettings;
    private contacts: ContactSchema[];
    private graphCaseCollector: GraphCaseCollector;

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

    execute = async () => {
        const graphCases = await this.graphCaseCollector.execute();
        const kruskal = new Kruskal(graphCases, this.distanceMatrixAssembly);
        const mstLinks = kruskal.getMSTLinks();

        // create node objects for forced directed graph
        this.generateCustomNodes(graphCases);

        // create link objects for sequenced cases (MST)
        this.generateCustomLinks(mstLinks, graphCases);

        // create link objects for contacts
        if (this.settings.showContactTracingLinks && this.contacts) {
            this.generateContactLinks(graphCases, this.contacts);
        }

        return { nodes: this.nodes, links: this.links };
    };

    private generateCustomLinks = (mstLinks: Link[], graphCases: CaseWithRelationships[]) => {
        this.links = mstLinks.map((link) => {
            return {
                source: graphCases[link.source].id,
                target: graphCases[link.target].id,
                value: link.weight.toString(),
                color: COLOR_FOR_GENETIC_DISTANCE_LINKS,
                curvature: 0,
                type: i18next.t("linkTypes.geneticDistance"),
                context: "",
            };
        }) satisfies CustomLink[];
    };

    private generateCustomNodes = (graphCases: CaseWithRelationships[]) => {
        this.nodes = graphCases.map((caseData) => {
            return {
                id: caseData.id,
                caseData: caseData,
                cluster: caseData.outbreak ? caseData.outbreak.name : i18next.t("clusterTypes.noOutbreakAssigned"),
                registeredAt: caseData.registered_at.toLocaleDateString(),
            } satisfies CustomNode;
        });
    };

    private generateContactLinks = (graphCases: CaseWithRelationships[], contacts: ContactSchema[]) => {
        // create a array with the ids of the cases which are in the already filtered graphCases array
        const graphCasesIds = graphCases.map((caseData) => caseData.id);

        // create a color map for the contact types
        const contactLinksColorMap = this.createColorMapForContactLinks(contacts);

        const contactTracingLinks: CustomLink[] = [];
        // create link objects for contacts
        for (const contact of contacts) {
            // only add contact links if both contact cases are in the already filtered graphCases array
            if (graphCasesIds.includes(contact.case_id_1) && graphCasesIds.includes(contact.case_id_2)) {
                const link = {
                    source: contact.case_id_1,
                    target: contact.case_id_2,
                    value: "",
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

    private createColorMapForContactLinks = (contacts: ContactSchema[]) => {
        const contactTypes = contacts.map((contact) => contact.type);
        const uniqueContactTypes = [...new Set(contactTypes)];

        const contactLinksColorMap: ContactLinksColorMap = {};
        uniqueContactTypes.forEach((contactType, index) => {
            contactLinksColorMap[contactType] = COLOR_PALETTE_LINKS[index] || createColor(index);
        });

        return contactLinksColorMap;
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
