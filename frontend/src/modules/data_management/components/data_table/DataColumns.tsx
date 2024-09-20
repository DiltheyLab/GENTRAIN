import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/modules/core/components/ui/Dropdown-menu";
import { toast } from "@/modules/core/components/ui/UseToast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/modules/core/components/ui/HoverCard";
import { Separator } from "@/modules/core/components/ui/Separator";
import { formatDate } from "@/modules/core/helpers/dates";
import { CaseWithRelationships, deleteCaseByIdAndRecalculateDistances } from "@/modules/core/models/cases";
import { useCoreStore } from "@/modules/core/stores/core";

export const DataColumns: ColumnDef<CaseWithRelationships>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "case_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fall
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize">{row.original.case_id}</div>,
    },
    {
        accessorKey: "sequence",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sequenz
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const sample = row.original.sample;
            if (sample) {
                return (
                    <>
                        <div>
                            <small>
                                <b>{sample.fasta_id}</b>
                            </small>
                        </div>
                        {sample.sequence_analysis?.schema && (
                            <div>
                                <small>Schema: {sample.sequence_analysis?.schema}</small>
                            </div>
                        )}
                        {sample.sequence_analysis?.chewbbaca_version && (
                            <div>
                                <small>chewBBACA Version: {sample.sequence_analysis?.chewbbaca_version}</small>
                            </div>
                        )}
                        {sample.sequence_analysis?.nextclade_version && (
                            <div>
                                <small>Nextclade Version: {sample.sequence_analysis?.nextclade_version}</small>
                            </div>
                        )}
                        {sample.lineage && (
                            <div>
                                <small>Abstammung: {sample.lineage}</small>
                            </div>
                        )}
                        {sample.n_count && (
                            <div>
                                <small>Ambigious Characters: {sample.n_count}</small>
                            </div>
                        )}
                        {sample.lineage && <p>Abstammung: {sample.lineage}</p>}
                        {sample.n_count && <p>Ns: {sample.n_count}</p>}
                        {sample.ambiguity_character_count && (
                            <p>IUPAC Ambiguity Characters: {sample.ambiguity_character_count}</p>
                        )}
                        {sample.contig_count && <p>Contigs: {sample.contig_count}</p>}
                        {sample.first_contig_length && <p>Länge erster Contig: {sample.first_contig_length}</p>}
                        {sample.undeterminable_gen_count && (
                            <p>Unbestimmbare Gene: {sample.undeterminable_gen_count}</p>
                        )}
                    </>
                );
            }

            return <div>{row.original.fasta_id ?? ""}</div>;
        },
    },
    {
        accessorKey: "outbreak",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ausbruch
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const outbreak = row.original.outbreak;
            if (!outbreak) return;
            return (
                <div>
                    <small className="cursor-default bg-slate-900 text-white py-1 px-2 rounded-xl font-bold">
                        {outbreak ? outbreak.name : ""}
                    </small>
                </div>
            );
        },
    },
    {
        accessorKey: "contacts",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Kontakte
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const contacts = row.original.contacts;
            if (!contacts) return;
            const caseIds = Object.keys(contacts);
            return (
                <>
                    {caseIds.map((case_id: string) => (
                        <HoverCard key={case_id} openDelay={50} closeDelay={50}>
                            <HoverCardTrigger asChild>
                                <div className="mb-1">
                                    <small className="cursor-default border-[1px] border-slate-900 text-black py-1 px-2 rounded-xl font-bold">
                                        {case_id}
                                    </small>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-center py-0 px-2 w-auto">
                                {contacts[case_id].map((contact, index) => {
                                    return (
                                        <div key={index}>
                                            <div>
                                                <small key={index}>{contact.type}</small>
                                            </div>
                                            {index < contacts[case_id].length - 1 && <Separator />}
                                        </div>
                                    );
                                })}
                            </HoverCardContent>
                        </HoverCard>
                    ))}
                </>
            );
        },
    },
    {
        accessorKey: "groups",
        header: () => <div>Gruppen</div>,
        cell: ({ row }) => {
            const groups = row.original.groups;
            return (
                <div>
                    {groups &&
                        groups.map((group) => (
                            <div key={group.name}>
                                <small>
                                    <b>{group.category?.name}: </b>
                                    {group.name}
                                </small>
                            </div>
                        ))}
                </div>
            );
        },
    },
    {
        accessorKey: "registered_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Registrierungsdatum
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="capitalize">{formatDate(row.original.registered_at)}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const deleteCase = async () => {
                try {
                    await deleteCaseByIdAndRecalculateDistances(row.original.id);
                    await useCoreStore.getState().updateCasesWithRelationships();
                } catch (error) {
                    toast({
                        title: "Fall konnte nicht gelöscht werden.",
                        duration: 10000,
                        variant: "destructive",
                    });
                }
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={deleteCase}>
                            Entfernen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
