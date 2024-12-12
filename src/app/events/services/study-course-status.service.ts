import { Injectable } from "@angular/core";
import {
  Observable,
  bufferCount,
  combineLatest,
  concatMap,
  delay,
  from,
  map,
  of,
  switchMap,
} from "rxjs";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { StudentEntry } from "./events-students-state.service";

export type StudyCourseStatus = {
  id: number;
  name: string;
};

const BATCH_SIZE = 5;
const BATCHES_DELAY_MS = 1000;

@Injectable({
  providedIn: "root",
})
export class StudyCourseStatusService {
  constructor(private statusProcessService: StatusProcessesRestService) {}

  /**
   * Returns the available states to switch to from the `currentState`,
   * including `currentState`.
   */
  getAvailableStatus(
    currentStatus: Option<StudyCourseStatus>,
  ): Observable<ReadonlyArray<StudyCourseStatus>> {
    return (
      currentStatus
        ? this.statusProcessService.getForwardByStatus(currentStatus.id)
        : of([])
    ).pipe(
      map((statusProcesses) =>
        statusProcesses
          .filter(
            // TODO: Should we really filter these "Hist." entries like this?
            (statusProcess) => !statusProcess.Status.startsWith("Hist."),
          )
          .map((statusProcess) => ({
            id: statusProcess.IdStatus,
            name: statusProcess.Status,
          })),
      ),
      map((status) => (currentStatus ? [currentStatus, ...status] : status)),
    );
  }

  /**
   * Update the status of the given student entries in batches.
   *
   * This method is designed to prevent the server from being overloaded with
   * requests when a large number of student entries are updated at once.
   *
   * Batches are sent with a delay of BATCHES_DELAY_MS milliseconds between each
   * other. This ensures that not all requests are sent at the same time, but
   * still allows for a relatively fast update process.
   */
  bulkUpdateStatus(
    studentEntries: ReadonlyArray<StudentEntry>,
    statusId: number,
  ): Observable<void> {
    return from(studentEntries).pipe(
      bufferCount(BATCH_SIZE),
      concatMap((batch, i) =>
        of(null).pipe(
          delay(i === 0 ? 0 : BATCHES_DELAY_MS), // Wait before processing the batch, but not if is the first one
          switchMap(() =>
            this.updateBatch(batch, statusId).pipe(delay(BATCHES_DELAY_MS)),
          ),
        ),
      ),
    );
  }

  private updateBatch(
    batch: ReadonlyArray<StudentEntry>,
    statusId: number,
  ): Observable<void> {
    return combineLatest(
      batch.map(({ id, subscriptionId }) =>
        subscriptionId
          ? this.statusProcessService.updateStatus(subscriptionId, id, statusId)
          : of(undefined),
      ),
    ).pipe(map(() => undefined));
  }
}
