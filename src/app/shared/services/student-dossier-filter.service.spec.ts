import { TestBed } from "@angular/core/testing";
import { buildAdditionalInformation } from "../../../spec-builders";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { StudentDossierFilterService } from "./student-dossier-filter.service";
import { StudentDossierEntry } from "./student-dossier.service";

describe("StudentDossierFilterService", () => {
  let service: StudentDossierFilterService;

  const buildEntry = (
    id: number,
    codeId: number,
    category: string,
  ): StudentDossierEntry => ({
    id,
    type: "dossier",
    additionalInformation: { ...buildAdditionalInformation(), CodeId: codeId },
    category,
    isOwner: false,
  });

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [StudentDossierFilterService],
      }),
    );
    service = TestBed.inject(StudentDossierFilterService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("filterOptions$", () => {
    it("emits unique, sorted options based on dossier entries", (done) => {
      const entries: ReadonlyArray<StudentDossierEntry> = [
        buildEntry(1, 101, "Zeugnis"),
        buildEntry(2, 102, "Gesuch"),
        buildEntry(3, 101, "Zeugnis"),
      ];
      service.setDossierEntries(entries);

      service.filterOptions$.subscribe((options) => {
        expect(options.map((o) => o.Value)).toEqual(["Gesuch", "Zeugnis"]);
        done();
      });
    });
  });

  describe("isFilterActive$", () => {
    it("emits true when at least one category is selected", (done) => {
      service.setSelectedCategories(["Zeugnis"]);
      service.isFilterActive$.subscribe((active) => {
        expect(active).toBeTrue();
        done();
      });
    });

    it("emits false when no category is selected", (done) => {
      service.isFilterActive$.subscribe((active) => {
        expect(active).toBeFalse();
        done();
      });
    });
  });
});
