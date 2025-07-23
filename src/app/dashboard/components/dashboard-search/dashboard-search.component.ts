import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { DropDownItem } from "../../../shared/models/drop-down-item.model";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";

@Component({
  selector: "bkd-dashboard-search",
  templateUrl: "./dashboard-search.component.html",
  styleUrls: ["./dashboard-search.component.scss"],
  imports: [TypeaheadComponent],
})
export class DashboardSearchComponent {
  personsRestService = inject(PersonsRestService);
  private router = inject(Router);

  async navigateToDossier(key: DropDownItem["Key"]) {
    const id = Number(key);
    await this.router.navigate(["dashboard", "student", id, "contact"]);
  }
}
