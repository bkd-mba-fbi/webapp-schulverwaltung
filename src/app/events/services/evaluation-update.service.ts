import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { EvaluationStateService } from "./evaluation-state.service";

@Injectable({
  providedIn: "root",
})
export class EvaluationUpdateService {
  private gradingItemsRestService = inject(GradingItemsRestService);
  evaluationStateService = inject(EvaluationStateService);

  async updateDefaultGrade(selectedGradeId: number): Promise<boolean> {
    const updatedGradingItems = this.evaluationStateService
      .gradingItems()
      .map((item) => ({
        ...item,
        IdGrade: selectedGradeId,
      }));
    /*const event = this.evaluationStateService.event();*/
    /*debugger;*/
    try {
      await firstValueFrom(
        this.gradingItemsRestService.updateForEvent(10064, updatedGradingItems),
      );
    } catch (error) {
      console.error("Error updating grades", error);
      return false;
    }
    this.evaluationStateService.updateGradingItems(updatedGradingItems);
    return true;
  }
}
