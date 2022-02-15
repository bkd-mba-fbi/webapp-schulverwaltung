import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'erz-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent {
  constructor(private route: ActivatedRoute) {}
}
