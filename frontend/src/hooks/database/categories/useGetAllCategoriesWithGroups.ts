import { CategoriesWithGroups, getAllCategoriesWithGroups } from "@/database/categories";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCategoriesWithGroups = (): CategoriesWithGroups[] | undefined => {
    return useLiveQuery(() => getAllCategoriesWithGroups());
};
