export const groupBy = function (objectToBeGrouped: any, key: string) {
    return objectToBeGrouped.reduce(function (groupedObject: any, x: any) {
        (groupedObject[x[key]] = groupedObject[x[key]] || []).push(x);
        return groupedObject;
    }, {});
};
