import { Component, OnInit } from '@angular/core';
import { OpenAbsencesService } from '../../services/open-absences.service';

@Component({
  selector: 'erz-open-absences-edit',
  templateUrl: './open-absences-edit.component.html',
  styleUrls: ['./open-absences-edit.component.scss']
})
export class OpenAbsencesEditComponent implements OnInit {
  constructor(private openAbsencesService: OpenAbsencesService) {
    console.log('selected entries:', openAbsencesService.selected);
  }

  ngOnInit(): void {}
}
