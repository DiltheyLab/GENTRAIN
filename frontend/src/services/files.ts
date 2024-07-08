const downloadFile = (blob: Blob, name: string) => {
    const jsonURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = jsonURL;
    tempLink.setAttribute("download", name);
    tempLink.click();
    tempLink.remove();
};
export { downloadFile };
