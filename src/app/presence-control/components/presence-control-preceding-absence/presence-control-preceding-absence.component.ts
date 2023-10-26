import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LessonAbsence } from "../../../shared/models/lesson-absence.model";

@Component({
  selector: "erz-presence-control-preceding-absence",
  templateUrl: "./presence-control-preceding-absence.component.html",
  styleUrls: ["./presence-control-preceding-absence.component.scss"],
})
export class PresenceControlPrecedingAbsenceComponent {
  @Input() precedingAbsences: ReadonlyArray<LessonAbsence>;

  constructor(public activeModal: NgbActiveModal) {}
}
