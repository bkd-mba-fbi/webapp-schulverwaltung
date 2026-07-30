import { DatePipe } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { isEqual } from "date-fns";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";

interface BlockLessonOption {
  entry: PresenceControlEntry;
  selected: boolean;
}

@Component({
  selector: "bkd-presence-control-block-lesson-component",
  templateUrl: "./presence-control-block-lesson.component.html",
  styleUrls: ["presence-control-block-lesson.component.scss"],
  imports: [FormsModule, DatePipe, TranslatePipe],
})
export class PresenceControlBlockLessonComponent {
  protected readonly activeModal = inject(NgbActiveModal);

  readonly entry = input.required<PresenceControlEntry>();
  readonly blockPresenceControlEntries =
    input.required<ReadonlyArray<PresenceControlEntry>>();

  protected readonly blockLessonOptions = computed(() =>
    this.blockPresenceControlEntries().map((entry) => ({
      entry,
      selected: entry.confirmationState === this.entry().confirmationState,
    })),
  );

  protected readonly selectedEntries = computed(() =>
    this.blockLessonOptions()
      .filter(({ selected }) => selected)
      .map(({ entry }) => entry),
  );

  protected isCurrentLesson(option: BlockLessonOption): boolean {
    return isEqual(
      option.entry.lessonPresence.LessonDateTimeFrom,
      this.entry().lessonPresence.LessonDateTimeFrom,
    );
  }
}
