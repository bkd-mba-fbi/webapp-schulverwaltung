import { Component } from "@angular/core";

// renders a line and preserves the current line height, even if the content is null or undefined
@Component({
  selector: "bkd-preserve-line-height",
  template: `<div><ng-content></ng-content>&nbsp;</div>`,
  styles: [],
  standalone: true,
})
export class PreserveLineHeightComponent {}
