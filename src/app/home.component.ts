import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-home',
  template: `
    <ul class="mt-3">
      <li *ngFor="let section of sections">
        <h2>
          <a [routerLink]="'/' + section">
            {{ section + '.title' | translate }}
          </a>
        </h2>
      </li>
    </ul>
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  sections: ReadonlyArray<string> = [
    'dashboard',
    'presence-control',
    'open-absences',
    'edit-absences',
    'evaluate-absences',
    'events',
    'person-search',
    'my-absences',
    'my-profile',
    'my-grades',
    'my-settings',
  ];
}
