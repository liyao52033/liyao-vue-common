export function useFileDownloader() {
    // Base64 转 Uint8Array
    const base64ToArrayBuffer = (base64: string) => {
        const binaryString = window.atob(base64);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    // Base64 下载文件
    const base64ToFile = (base64Data: string, filename: string, mimeType: string) => {
        const uint8Array = base64ToArrayBuffer(base64Data);
        const blob = new Blob([uint8Array], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    };

    // Blob 下载文件
    const blobToFile = (blobData: Blob, filename: string, mimeType: string) => {
        const blob = new Blob([blobData], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    };

    return { base64ToFile, blobToFile };
}
