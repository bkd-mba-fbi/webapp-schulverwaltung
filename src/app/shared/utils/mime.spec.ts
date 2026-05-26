import { getExtensionFromMimeType } from "./mime";

describe("mime utils", () => {
  describe("getExtensionFromMimeType", () => {
    it('returns "pdf" for type "application/pdf"', () => {
      expect(getExtensionFromMimeType("application/pdf")).toBe("pdf");
    });

    it('returns "docx" for type "application/vnd.openxmlformats-officedocument.wordprocessingml.document"', () => {
      expect(
        getExtensionFromMimeType(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      ).toBe("docx");
    });

    it('returns null for unknown type "text/x-gibberish"', () => {
      expect(getExtensionFromMimeType("text/x-gibberish")).toBeNull();
    });
  });
});
