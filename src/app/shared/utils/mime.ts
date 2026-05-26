const mimeTypes: Record<string, string> = {
  "text/plain": "txt",
  "application/json": "json",
  "application/zip": "zip",

  // Documents
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",

  // Images
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",

  // Emails
  "message/rfc822": "eml",
  "application/vnd.ms-outlook": "msg",
};

/**
 * Returns the file extension for the given MIME/content type. The lookup is
 * based on a very limited set of mime types. Returns null if no entry is found.
 */
export function getExtensionFromMimeType(mimeType: string): Option<string> {
  const extension = mimeTypes[mimeType] ?? null;
  if (!extension) {
    console.warn(`File extension for content type "${mimeType}" not found`);
  }
  return extension;
}
