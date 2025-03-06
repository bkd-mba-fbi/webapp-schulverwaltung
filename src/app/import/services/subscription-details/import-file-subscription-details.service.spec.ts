import { TestBed } from "@angular/core/testing";
import { utils, write } from "xlsx";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EmptyFileError,
  MissingColumnsError,
} from "../common/import-file.service";
import { ImportFileSubscriptionDetailsService } from "./import-file-subscription-details.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("ImportFileSubscriptionDetailsService", () => {
  let service: ImportFileSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ImportFileSubscriptionDetailsService],
      }),
    );
    service = TestBed.inject(ImportFileSubscriptionDetailsService);
  });

  describe("parseAndVerify", () => {
    it("returns the parsed entries without error for a valid Excel file with person ID", async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "ID Person": 1569,
          "ID AD": 3520,
          Wert: "Lorem ipsum",
          "Erklärung zum Wert": "Titel der Maturaarbeit",
        },
      ]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([
        {
          eventId: 8750,
          personId: 1569,
          personEmail: undefined,
          subscriptionDetailId: 3520,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeNull();
    });

    it("returns the parsed entries without error for a valid Excel file with email", async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "E-Mail": "s1@test.ch",
          "ID AD": 3520,
          Wert: "Lorem ipsum",
          "Erklärung zum Wert": "Titel der Maturaarbeit",
        },
      ]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([
        {
          eventId: 8750,
          personId: undefined,
          personEmail: "s1@test.ch",
          subscriptionDetailId: 3520,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeNull();
    });

    it("returns an error for an invalid Excel file", async () => {
      const buffer = new TextEncoder().encode("Lorem ipsum");
      const file = new File([buffer], "text.txt", { type: "text/plain" });
      const { error } = await service.parseAndVerify(file);
      expect(error).toBeInstanceOf(EmptyFileError);
    });

    it("returns an error for an empty Excel file", async () => {
      const file = createExcel([]);
      const { error } = await service.parseAndVerify(file);
      expect(error).toBeInstanceOf(EmptyFileError);
    });

    it("returns an error for an Excel file with only 3 columns", async () => {
      const file = createExcel([
        {
          "ID Person": 1569,
          "ID AD": 3520,
          Wert: "Lorem ipsum",
        },
      ]);
      const { error } = await service.parseAndVerify(file);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.actualColumns).toBe(3);
      expect((error as any)?.requiredColumns).toBe(4);
    });

    it("returns an error for an Excel file with only 1 column", async () => {
      const file = createExcel([
        {
          Wert: "Lorem ipsum",
        },
      ]);
      const { error } = await service.parseAndVerify(file);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.actualColumns).toBe(1);
      expect((error as any)?.requiredColumns).toBe(4);
    });
  });

  function createExcel(rows: Dict<unknown>[]): File {
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Subscription Details");
    const blob = write(workbook, { bookType: "xlsx", type: "buffer" });
    return new File([blob], "entries.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
});
