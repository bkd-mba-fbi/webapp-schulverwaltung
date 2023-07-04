import { Component, Inject } from '@angular/core';
import { Settings, SETTINGS } from '../../../settings';
import { Params } from '@angular/router';

@Component({
  selector: 'erz-dashboard-actions',
  templateUrl: './dashboard-actions.component.html',
  styleUrls: ['./dashboard-actions.component.scss'],
})
export class DashboardActionsComponent {
  constructor(@Inject(SETTINGS) public settings: Settings) {}

  get editAbsencesParams(): Params {
    return { confirmationStates: this.settings.checkableAbsenceStateId };
  }

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }
}
