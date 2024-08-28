export const parseGermanDateFormat = (dateString: string) => {
    var dmy = dateString.split(".");

    return new Date(parseInt(dmy[2]), parseInt(dmy[1]) - 1, parseInt(dmy[0]));
};

export const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return (day < 10 ? `0${day}` : day) + "." + (month < 10 ? `0${month}` : month) + "." + date.getFullYear();
};
