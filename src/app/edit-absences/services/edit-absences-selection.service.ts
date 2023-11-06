import { Injectable } from "@angular/core";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { SelectionService } from "src/app/shared/services/selection.service";

@Injectable()
export class EditAbsencesSelectionService extends SelectionService<LessonPresence> {}
