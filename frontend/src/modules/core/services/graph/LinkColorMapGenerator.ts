import { COLOR_PALETTE_LINKS, createColorByGoldenAngleApproximation } from "@/modules/core/helpers/colors";
import { ContactSchema } from "@/modules/core/models/contacts";
import { ContactLinksColorMap } from "@/modules/core/types/graph";

export class LinkColorMapGenerator {
    private contacts: ContactSchema[];
    private colorMap: ContactLinksColorMap = {};

    constructor(contacts: ContactSchema[]) {
        this.contacts = contacts;
    }

    public createColorMapForContactLinks = () => {
        const contactTypes = this.contacts.map((contact) => contact.type);
        const uniqueContactTypes = [...new Set(contactTypes)];

        uniqueContactTypes.forEach((contactType, index) => {
            this.colorMap[contactType] = COLOR_PALETTE_LINKS[index] || createColorByGoldenAngleApproximation(index);
        });

        return this.colorMap;
    };
}
