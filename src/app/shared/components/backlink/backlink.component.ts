import { Component, Input } from '@angular/core';
import { Params } from '@angular/router';

@Component({
  selector: 'erz-backlink',
  templateUrl: './backlink.component.html',
  styleUrls: ['./backlink.component.scss'],
})
export class BacklinkComponent {
  @Input()
  routerLink: string | any[] = [];

  @Input()
  queryParams?: Params | null;
}
