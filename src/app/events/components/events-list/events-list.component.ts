import { Component } from '@angular/core';
import { EventsStateService } from '../../services/events-state.service';

@Component({
  selector: 'erz-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent {
  constructor(public state: EventsStateService) {}
}
