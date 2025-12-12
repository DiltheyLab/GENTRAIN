import JSZip from "jszip";
import jschardet from "jschardet";

export const FASTA_EXTENSIONS = [".fa", ".mpfa", ".fna", ".fsa", ".fasta"];

/**
 * Create a download anchor tag to download a file. Removes it afterward.
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
 * Create a download anchor tag to download a file. Removes it afterward.
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
export const readFileAsText = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                // Convert Uint8Array to binary string for encoding detection
                const binaryString = Array.from(uint8Array)
                    .map((byte) => String.fromCharCode(byte))
                    .join("");
                // Detect encoding as export sources are not deterministic
                const detected = jschardet.detect(binaryString);
                const encoding = detected.encoding || "UTF-8";
                // Decode using TextDecoder with detected encoding
                const decoder = new TextDecoder(encoding);
                const text = decoder.decode(uint8Array);
                resolve(text);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

/**
 * This function reads multiple files as text
 * @param files - the files to read
 * @returns a promise that resolves with an array of the files' text content
 */
export const readFilesAsText = (files: File[]): Promise<string[]> => {
    const filePromises = files.map((file) => readFileAsText(file));
    return Promise.all(filePromises);
};

export const extractZip = async (file: File) => {
    const zip = await JSZip.loadAsync(file);
    const files = await Promise.all(
        Object.keys(zip.files).map((filename: string) =>
            zip.files[filename].async("blob").then(function (file) {
                return new File([file], filename);
            })
        )
    );
    return files;
};

export const extractFileExtension = (file: File) => {
    return file.name.substring(file.name.indexOf(".") + 1, file.name.length);
};

export const formatData = (
    fileReaderResult:
        | ({ filename: string; content: string; mimetype: string } | undefined)[]
        | { [filename: string]: string; mimetype: string }
) => {
    if (fileReaderResult instanceof Array) {
        // if the fileReaderResult is an array, we assume that it contains multiple files
        const fastaSequencesArray = [];
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
            const fastaSequences = Object.values(fileReaderResult)[0].split(/(?=>)/g);
            const fastaSequenceArray = collectFastaIdsAndSequences(fastaSequences);
            return fastaSequenceArray.flat(1);
        } else {
            let rows = Object.values(fileReaderResult)[0].split("\n");
            // filter empty lines to prevent empty cells
            rows = rows.filter((line) => line !== "");
            const columns: string[] = rows[0]
                .replace(/["'\n]/g, "")
                .split(";")
                .map((column: string) => column.trim());
            // Split lines into fields and remove leading/trailing whitespaces or
            // line breaks (in windows every line has a \r in the end after splitting by \n)
            const rowData = [];
            for (const index in rows) {
                if (parseInt(index) === 0) {
                    continue;
                }
                const rowArray = rows[parseInt(index)].replace(/["'\n]/g, "").split(";");
                const rowObject: { [key: string]: string } = {};
                rowArray.forEach((cell, index: number) => {
                    rowObject[columns[index]] = cell.trim();
                });
                rowData.push(rowObject);
            }
            return { columns: columns, rows: rowData };
        }
    }
};

/**
 * Create an object array containing fasta ids and sequences from fasta_id/sequence-strings.
 * @param fastaSequences
 * @returns
 */
export const collectFastaIdsAndSequences = (fastaSequences: Array<string>) => {
    const fastaSequencesArray = [];
    for (const sequence of fastaSequences) {
        const sequenceArray = sequence.split("\n");
        let fastaId = null;
        let genome = "";
        for (const element of sequenceArray) {
            if (element[0] === ">") {
                fastaId = element.slice(1).split(/\s+/)[0];
            } else {
                genome += element.trim();
            }
        }

        if (fastaId) {
            fastaSequencesArray.push({ fastaId: fastaId, sequence: genome });
        }
    }
    return fastaSequencesArray;
};
