import { Component } from '@angular/core';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
  providers: [TestStateService],
})
export class TestsComponent {
  constructor(public state: TestStateService) {}
}
