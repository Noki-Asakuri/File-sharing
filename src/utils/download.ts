const download = (fileUrl: string, fileName: string) => {
    let a = document.createElement("a");
    a.href = fileUrl;
    a.click();
    a.remove();
};

export default download;
