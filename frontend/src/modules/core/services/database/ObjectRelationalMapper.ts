export class ObjectRelationalMapper {
    public static arrayToMap = <T, K extends keyof T>(array: Array<T>, id: K & string = "id" as K & string) => {
        const map = new Map<T[K], T>();
        for (const entry of array) {
            map.set(entry[id], entry);
        }
        return map;
    };
}
