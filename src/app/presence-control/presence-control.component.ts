import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-presence-control',
  templateUrl: './presence-control.component.html',
  styleUrls: ['./presence-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
