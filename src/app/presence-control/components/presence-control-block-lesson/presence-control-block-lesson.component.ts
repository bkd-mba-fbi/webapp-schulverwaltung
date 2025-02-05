import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, inject, input } from "@angular/core";
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
export class PresenceControlBlockLessonComponent implements OnInit {
  activeModal = inject(NgbActiveModal);

  readonly entry = input.required<PresenceControlEntry>();
  @Input() blockPresenceControlEntries: ReadonlyArray<PresenceControlEntry>;
  blockLessonOptions: ReadonlyArray<BlockLessonOption> = [];

  // OnInit because input are set by modal and won't trigger the onChanges hook
  ngOnInit(): void {
    this.blockLessonOptions = this.buildLessonPresenceOptions();
  }

  getSelectedEntries(): ReadonlyArray<PresenceControlEntry> {
    return this.blockLessonOptions
      .filter(({ selected }) => selected)
      .map(({ entry }) => entry);
  }

  isCurrentLesson(option: BlockLessonOption): boolean {
    return isEqual(
      option.entry.lessonPresence.LessonDateTimeFrom,
      this.entry().lessonPresence.LessonDateTimeFrom,
    );
  }

  private buildLessonPresenceOptions() {
    return this.blockPresenceControlEntries.map((entry) => ({
      entry,
      selected: this.entry().confirmationState === entry.confirmationState,
    }));
  }
}
