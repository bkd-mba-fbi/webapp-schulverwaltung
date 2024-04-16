import { DatePipe, NgFor } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { LessonAbsence } from "../../../shared/models/lesson-absence.model";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";

@Component({
  selector: "erz-presence-control-preceding-absence",
  templateUrl: "./presence-control-preceding-absence.component.html",
  styleUrls: ["./presence-control-preceding-absence.component.scss"],
  standalone: true,
  imports: [NgFor, DatePipe, TranslateModule, AddSpacePipe],
})
export class PresenceControlPrecedingAbsenceComponent {
  @Input() precedingAbsences: ReadonlyArray<LessonAbsence>;

  constructor(public activeModal: NgbActiveModal) {}
}
