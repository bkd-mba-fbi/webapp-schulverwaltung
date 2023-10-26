import { Component, ChangeDetectionStrategy } from "@angular/core";

interface Section {
  path: string;
  name?: string;
}

@Component({
  selector: "erz-home",
  template: `
    <ul class="mt-3">
      <li *ngFor="let section of sections">
        <h2>
          <a [routerLink]="'/' + section.path">
            {{ (section.name ?? section.path) + ".title" | translate }}
          </a>
        </h2>
      </li>
    </ul>
  `,
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  sections: ReadonlyArray<Section> = [
    { path: "dashboard" },
    { path: "presence-control" },
    { path: "open-absences" },
    { path: "edit-absences" },
    { path: "evaluate-absences" },
    { path: "events" },
    { path: "events/current", name: "events.current" },
    { path: "my-absences" },
    { path: "my-profile" },
    { path: "my-grades" },
    { path: "my-settings" },
  ];
}
