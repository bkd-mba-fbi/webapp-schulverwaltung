import { provideHttpClient, withFetch } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildGradingItem } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradingItem } from "../../shared/models/grading-item.model";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { EvaluationGradingItemUpdateService } from "./evaluation-grading-item-update.service";
import {
  EvaluationEvent,
  EvaluationStateService,
} from "./evaluation-state.service";
import { TestStateService } from "./test-state.service";

describe("EvaluationGradingItemUpdateService", () => {
  let updateService: EvaluationGradingItemUpdateService;
  let gradingItemsRestServiceMock: jasmine.SpyObj<GradingItemsRestService>;
  let evaluationStateServiceMock: jasmine.SpyObj<EvaluationStateService>;
  let testStateServiceMock: jasmine.SpyObj<TestStateService>;
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
          EvaluationGradingItemUpdateService,
          provideHttpClient(withFetch()),
          {
            provide: GradingItemsRestService,
            useFactory() {
              gradingItemsRestServiceMock = jasmine.createSpyObj(
                "GradingItemsRestService",
                ["updateForEvent", "update", "updateComment"],
              );

              gradingItemsRestServiceMock.updateForEvent.and.returnValue(
                of(undefined),
              );

              gradingItemsRestServiceMock.update.and.returnValue(of(undefined));

              gradingItemsRestServiceMock.updateComment.and.returnValue(
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
          {
            provide: TestStateService,
            useFactory() {
              testStateServiceMock = jasmine.createSpyObj("TestStateService", [
                "reload",
              ]);
              return testStateServiceMock;
            },
          },
        ],
      }),
    );
    updateService = TestBed.inject(EvaluationGradingItemUpdateService);
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
      expect(testStateServiceMock.reload).toHaveBeenCalled();
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

    it("returns false when GradingItemsRestService throws exception", async () => {
      const selectedGradeId = 4567;
      gradingItemsRestServiceMock.updateForEvent.and.throwError(
        "Test exception",
      );
      const result = await updateService.updateDefaultGrade(selectedGradeId);

      expect(result).toBe(false);
      expect(gradingItemsRestServiceMock.updateForEvent).toHaveBeenCalledWith(
        mockEvent.id,
        mockGradingItems.map((item) => ({
          ...item,
          IdGrade: selectedGradeId,
        })),
      );
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).not.toHaveBeenCalled();
    });
  });

  describe("updateGrade", () => {
    it("updates a single grading item with the selected grade", async () => {
      const gradingItemId = mockGradingItem1.Id;
      const selectedGradeId = 5678;
      const result = await updateService.updateGrade(
        gradingItemId,
        selectedGradeId,
      );

      expect(result).toBe(true);
      expect(gradingItemsRestServiceMock.update).toHaveBeenCalledWith({
        ...mockGradingItem1,
        IdGrade: selectedGradeId,
      });
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).toHaveBeenCalledWith([
        { ...mockGradingItem1, IdGrade: selectedGradeId },
        mockGradingItem2,
      ]);
    });
  });

  describe("updateComment", () => {
    it("updates a single grading item with the provided comment", async () => {
      const gradingItemId = mockGradingItem1.Id;
      const comment = "Gute Leistung";

      const result = await updateService.updateComment(gradingItemId, comment);

      expect(result).toBe(true);
      expect(gradingItemsRestServiceMock.updateComment).toHaveBeenCalledWith(
        gradingItemId,
        comment,
      );
      expect(
        evaluationStateServiceMock.updateGradingItems,
      ).toHaveBeenCalledWith([
        { ...mockGradingItem1, Comment: comment },
        mockGradingItem2,
      ]);
    });
  });
});
