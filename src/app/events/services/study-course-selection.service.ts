import { Injectable } from "@angular/core";
import { SelectionService } from "src/app/shared/services/selection.service";
import { StudentEntry } from "./events-students-state.service";

@Injectable({
  providedIn: "root",
})
export class StudyCourseSelectionService extends SelectionService<StudentEntry> {}
