import { AsyncPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";
import { SortableHeaderComponent } from "../../../../shared/components/sortable-header/sortable-header.component";
import { TestStateService } from "../../../services/test-state.service";
import { TableHeaderComponent } from "../../common/table-header/table-header.component";
import { TestsTableFilterComponent } from "../tests-table-filter/tests-table-filter.component";
import { TestTableHeaderComponent } from "../tests-table-test-header/tests-table-test-header.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdTestsTableHeader]",
  imports: [
    AsyncPipe,
    NgClass,
    TranslatePipe,
    TestsTableFilterComponent,
    TestTableHeaderComponent,
    SortableHeaderComponent,
  ],
  templateUrl: "./tests-table-header.component.html",
  styleUrl: "./tests-table-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsTableHeaderComponent extends TableHeaderComponent {
  state = inject(TestStateService);

  @Input() selectedTest?: Test;

  @Output() publish = new EventEmitter<Test>();
  @Output() unpublish = new EventEmitter<Test>();
}
