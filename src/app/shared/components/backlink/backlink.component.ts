import { Component, input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-backlink",
  templateUrl: "./backlink.component.html",
  styleUrls: ["./backlink.component.scss"],
  imports: [RouterLink, TranslatePipe],
})
export class BacklinkComponent {
  readonly link = input<RouterLink["routerLink"]>([]);

  readonly params = input<Params | null>();
}
