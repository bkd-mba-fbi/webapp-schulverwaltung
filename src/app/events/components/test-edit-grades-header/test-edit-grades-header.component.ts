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
import { SortableHeaderComponent } from "../../../shared/components/sortable-header/sortable-header.component";
import { TestStateService } from "../../services/test-state.service";
import { TableHeaderComponent } from "../table-header/table-header.component";
import { TestTableFilterComponent } from "../test-table-filter/test-table-filter.component";
import { TestTableHeaderComponent } from "../test-table-header/test-table-header.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdTestEditGradesHeader]",
  imports: [
    AsyncPipe,
    NgClass,
    TranslatePipe,
    TestTableFilterComponent,
    TestTableHeaderComponent,
    SortableHeaderComponent,
  ],
  templateUrl: "./test-edit-grades-header.component.html",
  styleUrl: "./test-edit-grades-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestEditGradesHeaderComponent extends TableHeaderComponent {
  state = inject(TestStateService);

  @Input() selectedTest?: Test;

  @Output() publish = new EventEmitter<Test>();
  @Output() unpublish = new EventEmitter<Test>();
}
