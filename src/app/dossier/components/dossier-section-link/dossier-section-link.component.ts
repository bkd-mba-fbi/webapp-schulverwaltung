import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'erz-dossier-section-link',
  templateUrl: './dossier-section-link.component.html',
  styleUrls: ['./dossier-section-link.component.scss'],
})
export class DossierSectionLinkComponent {
  @Input() name: string;

  constructor() {}
}
