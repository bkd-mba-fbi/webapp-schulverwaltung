import { provideHttpClient, withFetch } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildGradingItem } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradingItem } from "../../shared/models/grading-item.model";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { EvaluationDefaultGradeUpdateService } from "./evaluation-default-grade-update.service";
import {
  EvaluationEvent,
  EvaluationStateService,
} from "./evaluation-state.service";

describe("EvaluationDefaultGradeUpdateService", () => {
  let updateService: EvaluationDefaultGradeUpdateService;
  let gradingItemsRestServiceMock: jasmine.SpyObj<GradingItemsRestService>;
  let evaluationStateServiceMock: jasmine.SpyObj<EvaluationStateService>;
  let mockEvent: EvaluationEvent;
  let mockGradingItem1: GradingItem;
  let mockGradingItem2: GradingItem;
  let mockGradingItems: GradingItem[];

  beforeEach(() => {
    mockEvent = {
      id: 1000,
      designation: "Clowns 101",
      type: "course",
      studentCount: 24,
      gradingScaleId: 10000,
    } as EvaluationEvent;

    mockGradingItem1 = buildGradingItem(10001, 1234);
    mockGradingItem2 = buildGradingItem(10002, 2345);
    mockGradingItems = [mockGradingItem1, mockGradingItem2];

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
    it("reflects the loading state from LoadingService", () => {
      expect(updateService.updating()).toBe(false);
    });
  });

  describe("updateDefaultGrade", () => {
    it("updates all grading items with the selected grade", async () => {
      const selectedGradeId = 3456;
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

    it("returns false when no event is selected", async () => {
      evaluationStateServiceMock.event.and.returnValue(null);

      const result = await updateService.updateDefaultGrade(4567);

      expect(result).toBe(false);
      expect(gradingItemsRestServiceMock.updateForEvent).not.toHaveBeenCalled();
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).not.toHaveBeenCalled();
    });
  });
});
