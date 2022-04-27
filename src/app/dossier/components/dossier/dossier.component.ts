import { Component } from '@angular/core';
import { DossierService } from '../../service/dossier.service';

@Component({
  selector: 'erz-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.scss'],
  providers: [DossierService],
})
export class DossierComponent {
  constructor() {}
}
