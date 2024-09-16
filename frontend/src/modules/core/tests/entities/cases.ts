import { CaseWithRelationships } from "../../models/cases";
import { GroupedContacts } from "../../models/contacts";
import { GroupWithRelationships } from "../../models/groups";
import { OutbreakSchema } from "../../models/outbreaks";
import { PathogenSchema } from "../../models/pathogens";
import { TestSample } from "./samples";

type TestCase = {
    id?: number;
    case_id?: string;
    fasta_id?: string | null;
    pathogen_id?: number;
    outbreak_id?: number | null;
    group_ids?: number[];
    registered_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    sample?: TestSample | null;
    pathogen?: PathogenSchema | null;
    outbreak?: OutbreakSchema | null;
    groups?: GroupWithRelationships[] | null;
    contacts?: GroupedContacts | null;
};

export const createCase = ({
    id = 0,
    case_id = ":case_id:",
    fasta_id = ":fasta_id:",
    pathogen_id = 0,
    outbreak_id = null,
    group_ids = [],
    registered_at = new Date(),
    created_at = new Date(),
    updated_at = new Date(),
    sample = null,
    pathogen = null,
    outbreak = null,
    groups = null,
    contacts = null,
}: TestCase) => {
    return {
        id: id,
        case_id: case_id,
        fasta_id: fasta_id,
        pathogen_id: pathogen_id,
        outbreak_id: outbreak_id,
        group_ids: group_ids,
        registered_at: registered_at,
        created_at: created_at,
        updated_at: updated_at,
        sample: sample,
        pathogen: pathogen,
        outbreak: outbreak,
        groups: groups,
        contacts: contacts,
    } as CaseWithRelationships;
};
