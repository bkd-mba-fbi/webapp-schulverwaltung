import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Subject, Subscription, concatMap, firstValueFrom, of } from "rxjs";
import { GradingItemsRestService } from "../../shared/services/grading-items-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { EvaluationStateService } from "./evaluation-state.service";
import { TestStateService } from "./test-state.service";

interface UpdateElement {
  Id: string;
  IdGrade: number | null;
  Comment: string | null;
  type: "grade" | "comment";
}

interface QueuedUpdateTask {
  updateElement: UpdateElement;
}

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

  queueSubscription: Subscription;

  private updateQueue$ = new Subject<QueuedUpdateTask>();

  constructor() {
    this.queueSubscription = this.updateQueue$
      .pipe(concatMap(async (task) => this.update(task)))
      .subscribe();
  }

  private async update(task: QueuedUpdateTask) {
    const gradingItem = this.evaluationStateService
      .gradingItems()
      .find((item) => item.Id === task.updateElement.Id);

    if (!gradingItem) {
      console.error("Grading item not found");
      return false;
    }

    let updatedGradingItem;
    if (task.updateElement.type === "grade") {
      updatedGradingItem = {
        ...gradingItem,
        IdGrade: task.updateElement.IdGrade,
      };
    } else {
      updatedGradingItem = {
        ...gradingItem,
        Comment: task.updateElement.Comment,
      };
    }

    try {
      await firstValueFrom(
        this.loadingService.load(
          this.gradingItemsRestService.update(
            updatedGradingItem.Id,
            updatedGradingItem,
          ),
          EVALUATION_UPDATE_CONTEXT,
        ),
      );

      this.evaluationStateService.updateGradingItems(
        this.evaluationStateService
          .gradingItems()
          .map((item) =>
            item.Id === updatedGradingItem.Id ? updatedGradingItem : item,
          ),
      );

      return of(true);
    } catch (error) {
      console.error("Error updating comment", error);
      return of(false);
    }
  }

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

  updateGrade(gradingItemId: string, gradeId: Option<number>) {
    this.updateQueue$.next({
      updateElement: {
        Id: gradingItemId,
        IdGrade: gradeId,
        Comment: null,
        type: "grade",
      },
    });
  }

  updateComment(gradingItemId: string, comment: Option<string>) {
    this.updateQueue$.next({
      updateElement: {
        Id: gradingItemId,
        IdGrade: null,
        Comment: comment,
        type: "comment",
      },
    });
  }
}
