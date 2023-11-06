import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DropDownItem } from "../../../shared/models/drop-down-item.model";
import { StudentsRestService } from "../../../shared/services/students-rest.service";

@Component({
  selector: "erz-dashboard-search",
  templateUrl: "./dashboard-search.component.html",
  styleUrls: ["./dashboard-search.component.scss"],
})
export class DashboardSearchComponent {
  constructor(
    public studentsRestService: StudentsRestService,
    private router: Router,
  ) {}

  navigateToDossier(key: DropDownItem["Key"]) {
    const id = Number(key);
    this.router.navigate(["dashboard", "student", id, "addresses"]);
  }
}
