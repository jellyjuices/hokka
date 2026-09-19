export function downloadBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadText(fileName: string, contents: string, mimeType: string) {
  downloadBlob(fileName, new Blob([contents], { type: mimeType }));
}
