import { Component, Input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";

@Component({
  selector: "erz-backlink",
  templateUrl: "./backlink.component.html",
  styleUrls: ["./backlink.component.scss"],
})
export class BacklinkComponent {
  @Input()
  routerLink: RouterLink["routerLink"] = [];

  @Input()
  queryParams?: Params | null;
}
