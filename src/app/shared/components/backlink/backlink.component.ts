import { Component, Input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-backlink",
  templateUrl: "./backlink.component.html",
  styleUrls: ["./backlink.component.scss"],
  imports: [RouterLink, TranslatePipe],
})
export class BacklinkComponent {
  @Input()
  link: RouterLink["routerLink"] = [];

  @Input()
  params?: Params | null;
}
