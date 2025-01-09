export const FASTA_EXTENSIONS = [".fa", ".mpfa", ".fna", ".fsa", ".fasta"];

/**
 * Create a download anchor tag to download a file. Removes it afterwards.
 * @param blob
 * @param name
 */
export const downloadFile = (blob: Blob, name: string) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = objectUrl;
    tempLink.setAttribute("download", name);
    tempLink.click();
    tempLink.remove();
};

/**
 * Create a download anchor tag to download a file. Removes it afterwards.
 * @param blob
 * @param name
 */
export const downloadFileFromUrl = (url: string) => {
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", url);
    tempLink.click();
    tempLink.remove();
};

/**
 * This function reads a file as text
 * @param file - the file to read
 * @returns a promise that resolves with the file's text content
 */
export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
};

/**
 * This function reads multiple files as text
 * @param files - the files to read
 * @returns a promise that resolves with an array of the files' text content
 */
export const readFilesAsText = (files: FileList): Promise<string[]> => {
    const filePromises = Array.from(files).map((file) => readFileAsText(file));
    return Promise.all(filePromises);
};

export const formatInArray = (
    fileReaderResult:
        | ({ filename: string; content: string; mimetype: string } | undefined)[]
        | { [filename: string]: string; mimetype: string }
) => {
    if (fileReaderResult instanceof Array) {
        // if the fileReaderResult is an array, we assume that it contains multiple files
        let fastaSequencesArray = [];
        for (const file of fileReaderResult) {
            if (file?.mimetype === "fasta") {
                // for bacterial uploads:
                // fasta file name contains fasta id
                // content contains assembly
                fastaSequencesArray.push({ fastaId: file.filename.split(".")[0], sequence: file.content });
            }
        }
        return fastaSequencesArray;
    } else {
        if (fileReaderResult.mimetype === "fasta") {
            // fasta header contains fasta id (viral)
            let fastaSquences = Object.values(fileReaderResult)[0].split(/(?=>)/g);
            let fastaSquenceArray = collectFastaIdsAndSequences(fastaSquences);
            return fastaSquenceArray.flat(1);
        } else {
            let lines = Object.values(fileReaderResult)[0].split("\n");
            // filter empty lines to prevent empty cells
            lines = lines.filter((line) => line !== "");
            // Split lines into fields and remove leading/trailing whitespaces or
            // line breaks (in windows every line has a \r in the end after splitting by \n)
            return lines.map((line) => line.split(";").map((cell) => cell.trim()));
        }
    }
};

/**
 * Create an object array containing fasta ids and sequences from fasta_id/sequence-strings.
 * @param fastaSequences
 * @returns
 */
export const collectFastaIdsAndSequences = (fastaSequences: Array<string>) => {
    let fastaSequencesArray = [];
    for (let sequence of fastaSequences) {
        let sequenceArray = sequence.split("\n");
        let fastaId = null;
        let genom = "";
        for (let element of sequenceArray) {
            if (element[0] === ">") {
                fastaId = element.slice(1).split(/\s+/)[0];
            } else {
                genom += element.trim();
            }
        }

        if (fastaId) {
            fastaSequencesArray.push({ fastaId: fastaId, sequence: genom });
        }
    }
    return fastaSequencesArray;
};
