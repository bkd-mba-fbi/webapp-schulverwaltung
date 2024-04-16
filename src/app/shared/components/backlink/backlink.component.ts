import { Component, Input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "erz-backlink",
  templateUrl: "./backlink.component.html",
  styleUrls: ["./backlink.component.scss"],
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
export class BacklinkComponent {
  @Input()
  link: RouterLink["routerLink"] = [];

  @Input()
  params?: Params | null;
}
