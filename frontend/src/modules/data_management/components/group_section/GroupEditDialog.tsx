import { Button } from "@/modules/core/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/modules/core/components/ui/Dialog";
import { Input } from "@/modules/core/components/ui/Input";
import { Label } from "@/modules/core/components/ui/Label";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { cn } from "@/modules/core/helpers/cn";
import { handleError } from "@/modules/core/helpers/errors";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { GroupSchema, updateGroupName } from "@/modules/core/models/groups";
import { useGetGroupsForActivePathogen } from "@/modules/core/hooks/database/groups/useGetGroupsForActivePathogen";
import { validatGroupName } from "../../helpers/groupNameValidation";
import { useCoreStore } from "@/modules/core/stores/core";

type GroupEditDialogProps = {
    row: Row<GroupSchema>;
};

export const GroupEditDialog = ({ row }: GroupEditDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupName, setGroupName] = useState(row.original.name);
    const [isTouched, setIsTouched] = useState(false);
    const groups = useGetGroupsForActivePathogen();
    const { groupNameNotValid, isUniqueName } = validatGroupName(
        groups?.filter((group) => group.name !== row.original.name),
        groupName
    );
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);

    const updateGroup = async () => {
        try {
            const groupId = await updateGroupName(row.original.id, groupName);
            if (!groupId) {
                throw new GentrainException("GroupIdIsNotInDB");
            }
        } catch (error) {
            handleError(error, "group");
        } finally {
            setIsOpen(false);
            updateCasesWithRelationships();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size={"icon"} variant={"secondary"}>
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gruppe bearbeiten</DialogTitle>
                    <DialogDescription>
                        Nehmen Sie hier Änderungen an der Gruppe vor. Klicken Sie auf Speichern, wenn Sie fertig sind.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 items-center mt-4">
                    <Label htmlFor="name" className="font-normal">
                        Name
                    </Label>
                    <Input
                        id="name"
                        className={cn("w-full", !isUniqueName() && "focus-visible:ring-red-500")}
                        value={groupName}
                        placeholder={row.original.name}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                        }}
                        onFocus={() => setIsTouched(true)}
                        onBlur={() => setIsTouched(false)}
                    />
                </div>
                {isTouched && !isUniqueName() && (
                    <p className="text-red-500 text-sm -mt-2">
                        Der Name der Gruppe ist bereits vergeben. Bitte wählen Sie einen anderen.
                    </p>
                )}
                <DialogFooter>
                    <Button type="submit" disabled={!groupNameNotValid()} onClick={updateGroup}>
                        Änderungen speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
