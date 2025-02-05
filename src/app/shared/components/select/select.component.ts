import { AsyncPipe, NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  input,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { DropDownItem } from "../../models/drop-down-item.model";

@Component({
  selector: "bkd-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AsyncPipe, NgStyle, TranslatePipe],
})
export class SelectComponent implements OnChanges {
  readonly options = input<ReadonlyArray<DropDownItem>>([]);
  @Input() allowEmpty = true;
  @Input() emptyLabel: string = "";
  readonly value = input<Option<number>>(null);
  readonly disabled = input<boolean>(false);
  readonly tabindex = input<number>(0);
  readonly width = input<string>("auto");

  @Output() valueChange = new EventEmitter<Option<number>>();

  options$ = new BehaviorSubject<ReadonlyArray<DropDownItem>>([]);
  rawValue$ = new BehaviorSubject<Option<number>>(null);

  value$ = combineLatest([this.rawValue$, this.options$]).pipe(
    map(
      ([rawValue, options]) =>
        (options && options.find((o) => o.Key === rawValue)) || null,
    ),
  );

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["value"]) {
      this.rawValue$.next(changes["value"].currentValue);
    }
    if (changes["options"]) {
      this.options$.next(changes["options"].currentValue);
    }
  }
}
