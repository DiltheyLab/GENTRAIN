import { CategoriesWithGroups, getAllCategoriesWithGroups } from "@/modules/core/models/categories";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCategoriesWithGroups = (): CategoriesWithGroups[] | undefined => {
    return useLiveQuery(() => getAllCategoriesWithGroups());
};
