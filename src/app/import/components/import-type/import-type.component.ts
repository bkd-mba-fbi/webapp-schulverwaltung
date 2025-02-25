import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ImportStateService } from "../../services/import-state.service";

@Component({
  selector: "bkd-import-type",
  templateUrl: "./import-type.component.html",
  styleUrl: "./import-type.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, NgClass],
})
export class ImportTypeComponent {
  @Input() importType: "subscriptionDetails" | "emails";
  stateService = inject(ImportStateService);
}
