import { Component, OnInit, Input } from '@angular/core';
import { Lesson } from 'src/app/shared/models/lesson.model';

@Component({
  selector: 'erz-presence-control-header',
  templateUrl: './presence-control-header.component.html',
  styleUrls: ['./presence-control-header.component.scss']
})
export class PresenceControlHeaderComponent implements OnInit {
  @Input() lesson: Lesson;
  constructor() {}

  ngOnInit(): void {}
}
