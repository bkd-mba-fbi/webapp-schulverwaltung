import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { DropDownItem } from "../../../shared/models/drop-down-item.model";
import { StudentsRestService } from "../../../shared/services/students-rest.service";

@Component({
  selector: "bkd-dashboard-search",
  templateUrl: "./dashboard-search.component.html",
  styleUrls: ["./dashboard-search.component.scss"],
  imports: [TypeaheadComponent],
})
export class DashboardSearchComponent {
  studentsRestService = inject(StudentsRestService);
  private router = inject(Router);

  async navigateToDossier(key: DropDownItem["Key"]) {
    const id = Number(key);
    await this.router.navigate(["dashboard", "student", id, "addresses"]);
  }
}
