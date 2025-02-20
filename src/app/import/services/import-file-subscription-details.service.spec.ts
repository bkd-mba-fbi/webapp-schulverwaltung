import { TestBed } from "@angular/core/testing";
import { utils, write } from "xlsx";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportFileSubscriptionDetailsService } from "./import-file-subscription-details.service";
import { EmptyFileError, MissingColumnsError } from "./import-file.service";

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
    it("returns the parsed entries without error for a valid Excel file", async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "ID Person": 1569,
          "E-Mail": "maximilian.muster@test.ch",
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
          personEmail: "maximilian.muster@test.ch",
          subscriptionDetailId: 3520,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeNull();
    });

    it("returns an error for an invalid Excel file", async () => {
      const buffer = new TextEncoder().encode("Lorem ipsum");
      const file = new File([buffer], "text.txt", { type: "text/plain" });
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([]);
      expect(error).toBeInstanceOf(EmptyFileError);
    });

    it("returns an error for an empty Excel file", async () => {
      const file = createExcel([]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([]);
      expect(error).toBeInstanceOf(EmptyFileError);
    });

    it('returns an error for a Excel file without "ID Anlass" column', async () => {
      const file = createExcel([
        {
          "ID Person": 1569,
          "E-Mail": "maximilian.muster@test.ch",
          "ID AD": 3520,
          Wert: "Lorem ipsum",
          "Erklärung zum Wert": "Titel der Maturaarbeit",
        },
      ]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([
        {
          eventId: undefined,
          personId: 1569,
          personEmail: "maximilian.muster@test.ch",
          subscriptionDetailId: 3520,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.columns).toEqual(["ID Anlass"]);
    });

    it('returns an error for a Excel file without "ID Person" column', async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "E-Mail": "maximilian.muster@test.ch",
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
          personEmail: "maximilian.muster@test.ch",
          subscriptionDetailId: 3520,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.columns).toEqual(["ID Person"]);
    });

    it('returns an error for a Excel file without "ID AD" column', async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "ID Person": 1569,
          "E-Mail": "maximilian.muster@test.ch",
          Wert: "Lorem ipsum",
          "Erklärung zum Wert": "Titel der Maturaarbeit",
        },
      ]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([
        {
          eventId: 8750,
          personId: 1569,
          personEmail: "maximilian.muster@test.ch",
          subscriptionDetailId: undefined,
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.columns).toEqual(["ID AD"]);
    });

    it('returns an error for a Excel file without "Wert" column', async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "ID Person": 1569,
          "E-Mail": "maximilian.muster@test.ch",
          "ID AD": "3520",
          "Erklärung zum Wert": "Titel der Maturaarbeit",
        },
      ]);
      const { entries, error } = await service.parseAndVerify(file);
      expect(entries).toEqual([
        {
          eventId: 8750,
          personId: 1569,
          personEmail: "maximilian.muster@test.ch",
          subscriptionDetailId: "3520",
          value: undefined,
        },
      ]);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.columns).toEqual(["Wert"]);
    });

    it('returns an error for a Excel file without "E-Mail" column', async () => {
      const file = createExcel([
        {
          "ID Anlass": 8750,
          "ID Person": 1569,
          "ID AD": "3520",
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
          subscriptionDetailId: "3520",
          value: "Lorem ipsum",
        },
      ]);
      expect(error).toBeInstanceOf(MissingColumnsError);
      expect((error as any)?.columns).toEqual(["E-Mail"]);
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
