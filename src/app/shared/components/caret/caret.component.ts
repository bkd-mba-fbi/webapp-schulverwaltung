import { Component, Input } from "@angular/core";

@Component({
  selector: "erz-caret",
  templateUrl: "./caret.component.html",
  styleUrls: ["./caret.component.scss"],
  standalone: true,
})
export class CaretComponent {
  @Input() expanded: boolean = false;
}
