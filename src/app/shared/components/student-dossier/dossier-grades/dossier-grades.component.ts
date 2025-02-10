import { AsyncPipe } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { DossierStateService } from "src/app/shared/services/dossier-state.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { DossierGradesViewComponent } from "../dossier-grades-view/dossier-grades-view.component";

@Component({
  selector: "bkd-dossier-grades",
  templateUrl: "./dossier-grades.component.html",
  styleUrls: ["./dossier-grades.component.scss"],
  imports: [DossierGradesViewComponent, SpinnerComponent, AsyncPipe],
})
export class DossierGradesComponent implements OnInit, OnDestroy {
  state = inject(DossierStateService);
  dossierGradesService = inject(DossierGradesService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.state.dossierPage$.next("grades");

    this.state.studentId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => this.dossierGradesService.setStudentId(id));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
