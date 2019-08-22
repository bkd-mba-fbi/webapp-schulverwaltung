import { Component, OnInit } from '@angular/core';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';

@Component({
  selector: 'erz-edit-absences-list',
  templateUrl: './edit-absences-list.component.html',
  styleUrls: ['./edit-absences-list.component.scss']
})
export class EditAbsencesListComponent implements OnInit {
  constructor(public state: EditAbsencesStateService) {}

  ngOnInit(): void {}
}
