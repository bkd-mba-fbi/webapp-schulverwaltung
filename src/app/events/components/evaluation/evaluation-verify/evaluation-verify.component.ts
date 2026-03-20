import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { PortalService } from "src/app/shared/services/portal.service";
import { EvaluationFinaliseDialogComponent } from "../evaluation-finalise-dialog/evaluation-finalise-dialog.component";
import { EvaluationHeaderComponent } from "../evaluation-header/evaluation-header.component";
import { EvaluationVerifyPdfComponent } from "../evaluation-verify-pdf/evaluation-verify-pdf.component";

@Component({
  selector: "bkd-evaluation-verify",
  imports: [
    TranslatePipe,
    SpinnerComponent,
    EvaluationHeaderComponent,
    EvaluationVerifyPdfComponent,
  ],
  templateUrl: "./evaluation-verify.component.html",
  styleUrl: "./evaluation-verify.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // We are forcing this component to take up the full viewport height. When
    // embedded in the portal iframe, we have to calculate this height
    // dynamically.
    "[style.min-height]": "hostHeight()",
  },
})
export class EvaluationVerifyComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  state = inject(EvaluationStateService);
  private modalService = inject(BkdModalService);
  private router = inject(Router);
  private portalService = inject(PortalService);

  hasGrades = computed(() => this.state.gradingScale() !== null);
  hasOpenEvaluations = computed(() =>
    this.state.entries().some((entry) => entry.evaluationRequired),
  );
  loadingPdf = signal(false);

  embedded = this.portalService.inIframe;
  hostHeight = signal<Option<string>>(this.getStandaloneHeight());

  ngOnInit() {
    // Make sure we have the correct hasOpenEvaluations value
    this.state.reload();
  }

  ngAfterViewInit() {
    if (this.embedded) {
      this.updateEmbeddedHeight();
      this.portalService.window?.addEventListener(
        "resize",
        this.updateEmbeddedHeight,
      );
    }
  }

  ngOnDestroy() {
    if (this.embedded) {
      this.portalService.window?.removeEventListener(
        "resize",
        this.updateEmbeddedHeight,
      );
    }
  }

  openFinaliseEvaluationDialog(): void {
    const modalRef = this.modalService.open(EvaluationFinaliseDialogComponent);
    const component =
      modalRef.componentInstance as EvaluationFinaliseDialogComponent;

    component.eventId.set(this.state.event()?.id ?? null);

    const hasOpenEvaluations = this.state
      .entries()
      .some((entry) => entry.evaluationRequired);
    component.hasOpenEvaluations.set(hasOpenEvaluations);

    modalRef.result.then(
      async (result) => {
        if (result) {
          await this.router.navigate(["events"]);
        }
      },
      () => {},
    );
  }

  private getStandaloneHeight(): string {
    const topOffset =
      document.querySelector("bkd-app")?.getBoundingClientRect()?.y ?? 0;
    return `calc(100vh - ${topOffset}px)`;
  }

  private updateEmbeddedHeight = () => {
    if (!this.embedded) return;

    this.hostHeight.set(
      `${this.portalService.getAvailableViewportHeight() - 20}px`,
    );
  };
}
