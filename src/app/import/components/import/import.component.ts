import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ImportStateService } from "../../services/import-state.service";

@Component({
  selector: "bkd-import",
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrl: "./import.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ImportStateService],
})
export class ImportComponent {}
