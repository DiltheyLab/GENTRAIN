export const mockFileList = (files: File[]) => {
    const input = document.createElement("input");
    const mockFileList = Object.create(input.files);
    for (const index in files) {
        mockFileList[index] = files[index];
    }
    Object.defineProperty(mockFileList, "length", { value: files.length });
    return mockFileList;
};
