import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-presence-control',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./presence-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
