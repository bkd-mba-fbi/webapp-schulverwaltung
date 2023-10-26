import { Injectable } from "@angular/core";

import { SelectionService } from "src/app/shared/services/selection.service";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";

@Injectable()
export class EditAbsencesSelectionService extends SelectionService<LessonPresence> {}
