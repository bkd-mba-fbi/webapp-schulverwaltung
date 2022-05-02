import { Component } from '@angular/core';
import { STUDENT_DOSSIER_BACKLINK } from 'src/app/shared/tokens/student-dossier-backlink';
import { EventsStateService } from '../../services/events-state.service';

@Component({
  selector: 'erz-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [
    EventsStateService,
    { provide: STUDENT_DOSSIER_BACKLINK, useValue: '/events' },
  ],
})
export class EventsComponent {
  constructor() {}
}
