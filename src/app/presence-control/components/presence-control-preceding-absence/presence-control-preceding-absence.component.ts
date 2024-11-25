import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { LessonAbsence } from "../../../shared/models/lesson-absence.model";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";

@Component({
  selector: "bkd-presence-control-preceding-absence",
  templateUrl: "./presence-control-preceding-absence.component.html",
  styleUrls: ["./presence-control-preceding-absence.component.scss"],
  imports: [DatePipe, TranslatePipe, AddSpacePipe],
})
export class PresenceControlPrecedingAbsenceComponent {
  @Input() precedingAbsences: ReadonlyArray<LessonAbsence>;

  constructor(public activeModal: NgbActiveModal) {}
}
