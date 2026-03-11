import { api } from "./api";

function fileNameFor(type, format) {
  return `${type}.${format === "excel" ? "xlsx" : format}`;
}

function parseFileName(contentDisposition, fallback) {
  if (!contentDisposition) {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1] || fallback;
}

export async function downloadReport(type, format) {
  const response = await api.get(`/reports/download/${type}/${format}`, { responseType: "blob" });
  const fallbackName = fileNameFor(type, format);
  const contentDisposition = response.headers["content-disposition"];
  const fileName = parseFileName(contentDisposition, fallbackName);
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
