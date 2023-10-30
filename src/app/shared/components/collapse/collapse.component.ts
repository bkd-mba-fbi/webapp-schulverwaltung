import { Component, Input } from "@angular/core";

@Component({
  selector: "erz-collapse",
  templateUrl: "./collapse.component.html",
  styleUrls: ["./collapse.component.scss"],
})
export class CollapseComponent {
  @Input() expanded: boolean = false;
}
