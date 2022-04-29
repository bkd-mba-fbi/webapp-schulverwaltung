import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-student-dossier-entry-header',
  templateUrl: './student-dossier-entry-header.component.html',
  styleUrls: ['./student-dossier-entry-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryHeaderComponent {
  @Input() opened = false;

  constructor() {}
}
