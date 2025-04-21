import { provideHttpClient, withFetch } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildGradingItem } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { EvaluationDefaultGradeUpdateService } from "./evaluation-default-grade-update.service";
import { EvaluationStateService } from "./evaluation-state.service";

describe("EvaluationDefaultGradeUpdateService", () => {
  let updateService: EvaluationDefaultGradeUpdateService;
  let gradingItemsRestServiceMock: jasmine.SpyObj<GradingItemsRestService>;
  let evaluationStateServiceMock: jasmine.SpyObj<EvaluationStateService>;
  const mockEvent = {
    id: 1000,
    designation: "Clowns 101",
    type: "course",
    studentCount: 24,
    gradingScaleId: 10000,
  };

  const mockGradingItem1 = buildGradingItem(10001, 100001);
  const mockGradingItem2 = buildGradingItem(10002, 100002);
  const mockGradingItems = [mockGradingItem1, mockGradingItem2];
  mockGradingItems.map((item) => ({
    ...item,
    IdGrade: 200001,
  }));

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          EvaluationDefaultGradeUpdateService,
          provideHttpClient(withFetch()),
          {
            provide: GradingItemsRestService,
            useFactory() {
              gradingItemsRestServiceMock = jasmine.createSpyObj(
                "GradingItemsRestService",
                ["updateForEvent"],
              );

              gradingItemsRestServiceMock.updateForEvent.and.returnValue(
                of(undefined),
              );

              return gradingItemsRestServiceMock;
            },
          },
          {
            provide: EvaluationStateService,
            useFactory() {
              evaluationStateServiceMock = jasmine.createSpyObj(
                "EvaluationStateService",
                ["updateGradingItems"],
                {
                  gradingItems: jasmine
                    .createSpy()
                    .and.returnValue(mockGradingItems),
                  event: jasmine.createSpy().and.returnValue(mockEvent),
                },
              );

              return evaluationStateServiceMock;
            },
          },
        ],
      }),
    );
    updateService = TestBed.inject(EvaluationDefaultGradeUpdateService);
  });

  describe("updating", () => {
    it("should reflect the loading state from LoadingService", () => {
      expect(updateService.updating()).toBe(false);
    });
  });

  describe("updateDefaultGrade", () => {
    it("should update all grading items with the selected grade", async () => {
      const selectedGradeId = 200001;
      const result = await updateService.updateDefaultGrade(selectedGradeId);

      expect(result).toBe(true);
      expect(gradingItemsRestServiceMock.updateForEvent).toHaveBeenCalledWith(
        mockEvent.id,
        mockGradingItems.map((item) => ({
          ...item,
          IdGrade: selectedGradeId,
        })),
      );
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).toHaveBeenCalledWith(
        mockGradingItems.map((item) => ({
          ...item,
          IdGrade: selectedGradeId,
        })),
      );
    });

    it("should return false when no event is selected", async () => {
      evaluationStateServiceMock.event.and.returnValue(null);

      const result = await updateService.updateDefaultGrade(200001);

      expect(result).toBe(false);
      expect(gradingItemsRestServiceMock.updateForEvent).not.toHaveBeenCalled();
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).not.toHaveBeenCalled();
    });
  });
});
