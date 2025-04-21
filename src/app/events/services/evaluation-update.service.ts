import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { firstValueFrom } from "rxjs";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { EvaluationStateService } from "./evaluation-state.service";

const EVALUATION_UPDATE_CONTEXT = "events-evaluation-default-grade-update";
@Injectable()
export class EvaluationUpdateService {
  private gradingItemsRestService = inject(GradingItemsRestService);
  private evaluationStateService = inject(EvaluationStateService);
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
    } catch (error) {
      console.error("Error updating grades", error);
      return false;
    }
    this.evaluationStateService.updateGradingItems(updatedGradingItems);
    return true;
  }
}
