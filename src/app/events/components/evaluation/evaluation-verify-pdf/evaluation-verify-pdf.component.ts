import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";
import {
  outputFromObservable,
  toObservable,
  toSignal,
} from "@angular/core/rxjs-interop";
import { TranslateService } from "@ngx-translate/core";
import { embed } from "pdfobject";
import { distinctUntilChanged, from, of, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { LoadingService } from "src/app/shared/services/loading-service";
import { ReportsService } from "src/app/shared/services/reports.service";
import { StorageService } from "src/app/shared/services/storage.service";

const EVALUATION_PDF_CONTEXT = "evaluation-verify-pdf";

@Component({
  selector: "bkd-evaluation-verify-pdf",
  imports: [SpinnerComponent],
  templateUrl: "./evaluation-verify-pdf.component.html",
  styleUrl: "./evaluation-verify-pdf.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationVerifyPdfComponent implements OnDestroy {
  private reportsService = inject(ReportsService);
  private storageService = inject(StorageService);
  private loadingService = inject(LoadingService);
  private settings = inject<Settings>(SETTINGS);
  private translate = inject(TranslateService);

  eventId = input.required<number>();

  loading = toSignal(this.loadingService.loading(EVALUATION_PDF_CONTEXT));
  loadingPdf = outputFromObservable(
    this.loadingService.loading(EVALUATION_PDF_CONTEXT),
  );

  reportUrl = computed(() => this.getReportUrlForEventId(this.eventId()));
  reportBlobUrl = toSignal(
    toObservable(this.reportUrl).pipe(
      distinctUntilChanged(),
      switchMap((url) =>
        url
          ? this.loadingService.load(
              from(this.fetchReportBlobUrl(url.toString())),
              { context: EVALUATION_PDF_CONTEXT },
            )
          : of(null),
      ),
    ),
  );

  constructor() {
    effect((onCleanup) => {
      const reportBlobUrl = this.reportBlobUrl();
      if (reportBlobUrl) {
        embed(reportBlobUrl.toString(), "#evaluation-verify-pdf", {
          fallbackLink: `<p>${this.translate.instant(
            "evaluation.verify.pdf-fallback",
          )}</p>`,
        });

        // Remove old blob URL in case it changes
        onCleanup(() => URL.revokeObjectURL(reportBlobUrl));
      }
    });
  }

  ngOnDestroy(): void {
    const reportBlobUrl = this.reportBlobUrl();
    if (reportBlobUrl) {
      // Remove blob URL to avoid memory leaks
      URL.revokeObjectURL(reportBlobUrl);
    }
  }

  print(): void {
    const reportBlobUrl = this.reportBlobUrl();
    if (!reportBlobUrl) return;

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = reportBlobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  }

  download(): void {
    const reportBlobUrl = this.reportBlobUrl();
    if (!reportBlobUrl) return;

    // We can't read the Content-Disposition header containing the report's
    // filename due to the cross origin policy, so we just define it here alike
    const reportId = this.settings.evaluationVerifyReport.id;
    const filename = `Anlass_${reportId}_${this.eventId()}.pdf`;

    const link = document.createElement("a");
    link.href = reportBlobUrl;
    link.download = filename;
    link.click();
  }

  private getReportUrlForEventId(eventId: Option<number>): Option<URL> {
    if (!eventId) return null;

    const reportUrl = this.reportsService.getEvaluationVerifyReportUrl(eventId);
    const url = new URL(reportUrl);
    url.searchParams.set("token", this.storageService.getAccessToken() ?? "");
    return url;
  }

  private async fetchReportBlobUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
