import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { firstValueFrom } from "rxjs";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { EvaluationStateService } from "./evaluation-state.service";
import { TestStateService } from "./test-state.service";

const EVALUATION_UPDATE_CONTEXT = "events-evaluation-default-grade-update";
@Injectable()
export class EvaluationGradingItemUpdateService {
  private gradingItemsRestService = inject(GradingItemsRestService);
  private evaluationStateService = inject(EvaluationStateService);
  private testStateService = inject(TestStateService);
  private loadingService = inject(LoadingService);

  updating = toSignal(this.loadingService.loading(EVALUATION_UPDATE_CONTEXT), {
    requireSync: true,
  });

  async updateDefaultGrade(selectedGradeId: number): Promise<boolean> {
    const updatedGradingItems = this.evaluationStateService
      .gradingItems()
      .map((item) => ({
        ...item,
        IdGrade: selectedGradeId,
      }));
    const event = this.evaluationStateService.event();
    if (!event) {
      console.error("No event selected");
      return false;
    }
    try {
      await firstValueFrom(
        this.loadingService.load(
          this.gradingItemsRestService.updateForEvent(
            event.id,
            updatedGradingItems,
          ),
          EVALUATION_UPDATE_CONTEXT,
        ),
      );

      // When coming from /events/:id/tests, make sure the grades will be
      // reloaded, when navigating back from the evaluation page
      this.testStateService.reload();
    } catch (error) {
      console.error("Error updating grades", error);
      return false;
    }
    this.evaluationStateService.updateGradingItems(updatedGradingItems);
    return true;
  }

  async updateGrade(
    gradingItemId: string,
    gradeId: Option<number>,
  ): Promise<boolean> {
    const gradingItem = this.evaluationStateService
      .gradingItems()
      .find((item) => item.Id === gradingItemId);

    if (!gradingItem) {
      console.error("Grading item not found");
      return false;
    }

    const updatedGradingItem = {
      ...gradingItem,
      IdGrade: gradeId,
    };

    try {
      await firstValueFrom(
        this.loadingService.load(
          this.gradingItemsRestService.update(updatedGradingItem),
          EVALUATION_UPDATE_CONTEXT,
        ),
      );

      this.evaluationStateService.updateGradingItems(
        this.evaluationStateService
          .gradingItems()
          .map((item) =>
            item.Id === gradingItem.Id ? updatedGradingItem : item,
          ),
      );

      this.testStateService.reload();
      return true;
    } catch (error) {
      console.error("Error updating grade", error);
      return false;
    }
  }
}
