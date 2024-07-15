export const parseGermanDateFormat = (dateString: string) => {
    var dmy = dateString.split(".");

    return new Date(parseInt(dmy[2]), parseInt(dmy[1]) - 1, parseInt(dmy[0]));
};
