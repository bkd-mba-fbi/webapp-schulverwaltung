import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { GradingItem } from "../../shared/models/grading-item.model";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";

@Injectable({
  providedIn: "root",
})
export class EvaluationUpdateService {
  private gradingItemsRestService = inject(GradingItemsRestService);
  updateDefaultGrade(
    eventId: number,
    gradeId: number,
    gradingItems: ReadonlyArray<GradingItem>,
  ): Observable<void> {
    const updatedGradingItems = gradingItems.map((item) => ({
      ...item,
      IdGrade: gradeId,
    }));

    return this.gradingItemsRestService.updateForEvent(
      eventId,
      updatedGradingItems,
    );
  }
}
