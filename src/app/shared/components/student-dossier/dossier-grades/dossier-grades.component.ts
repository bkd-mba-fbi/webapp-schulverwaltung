import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'erz-dossier-grades',
  templateUrl: './dossier-grades.component.html',
  styleUrls: ['./dossier-grades.component.scss'],
})
export class DossierGradesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('dossier-grades works!');
  }
}
