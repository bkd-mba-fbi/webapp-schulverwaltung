import { Component, Input } from '@angular/core';
import { EventsStateService } from '../../services/events-state.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'erz-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent {
  @Input() withRatings: boolean = true;
  constructor(
    public state: EventsStateService,
    private storage: StorageService
  ) {
    this.state.roles$.next(this.storage.getPayload()?.roles);
  }
}
