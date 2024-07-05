const downloadFile = (blob: Blob) => {
    const jsonURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = jsonURL;
    tempLink.setAttribute("download", `gentrain_export_${new Date().toLocaleString()}.json`);
    tempLink.click();
    tempLink.remove();
};
export { downloadFile };
