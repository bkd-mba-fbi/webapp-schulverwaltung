import { AsyncPipe } from "@angular/common";
import {
  Component,
  NO_ERRORS_SCHEMA,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  FormField,
  disabled,
  form,
  max,
  min,
  required,
} from "@angular/forms/signals";
import { RouterLink } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbInputDatepicker,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";
import { Observable, map, switchMap } from "rxjs";
import { FormErrorsComponent } from "src/app/shared/components/form-errors/form-errors.component";
import { SubmitButtonComponent } from "src/app/shared/components/submit-button/submit-button.component";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { ConfigurationsRestService } from "src/app/shared/services/configurations-rest.service";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { numberToString } from "src/app/shared/utils/number";
import { TestStateService } from "../../../services/test-state.service";

interface TestFormData {
  designation: string;
  date: Date;
  weight: number;
  isPointGrading: "true" | "false";
  maxPoints: Option<number>;
  maxPointsAdjusted: Option<number>;
  gradingScaleId: string;
}

export type TestFormValue = Omit<
  TestFormData,
  "isPointGrading" | "gradingScaleId"
> & {
  isPointGrading: boolean;
  gradingScaleId: number;
};

@Component({
  selector: "bkd-tests-edit-form",
  templateUrl: "./tests-edit-form.component.html",
  styleUrls: ["./tests-edit-form.component.scss"],
  schemas: [NO_ERRORS_SCHEMA], // otherwise html math tags are not allowed using template strict mode
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbInputDatepicker,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    SubmitButtonComponent,
    FormErrorsComponent,
    FormField,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
})
export class TestsEditFormComponent {
  private testStateService = inject(TestStateService);
  private configurationsService = inject(ConfigurationsRestService);
  private gradingScalesService = inject(GradingScalesRestService);

  test = input<Option<Test>>(null);
  defaultGradingScaleId = input<Option<number>>(null);
  saving = input(false);
  save = output<TestFormValue>();

  componentId = uniqueId("bkd-tests-edit-form");

  courseId$ = this.testStateService.courseId$;

  gradingScales = toSignal(this.loadGradingScales(), { initialValue: [] });

  testFormData = linkedSignal<TestFormData>(() => {
    const test = this.test();
    const isPointGrading = Boolean(test?.IsPointGrading);
    return {
      designation: test?.Designation ?? "",
      date: test?.Date ?? new Date(),
      weight: test?.Weight ?? 1,
      isPointGrading: isPointGrading ? "true" : "false",
      maxPoints: isPointGrading ? (test?.MaxPoints ?? null) : null,
      maxPointsAdjusted: isPointGrading
        ? (test?.MaxPointsAdjusted ?? null)
        : null,
      gradingScaleId: this.getGradingScaleIdValue() ?? "",
    };
  });
  testForm = form(this.testFormData, (schema) => {
    const hasResults = () => (this.test()?.Results?.length ?? 0) > 0;
    const isPointGrading = () => this.testFormData().isPointGrading === "true";

    required(schema.designation);
    required(schema.date);
    required(schema.weight);
    min(schema.weight, 0.01);
    disabled(schema.isPointGrading, hasResults);
    required(schema.maxPoints, { when: isPointGrading });
    min(schema.maxPoints, 0.01);
    max(schema.maxPoints, 999);
    disabled(schema.maxPoints, () => hasResults() || !isPointGrading());
    min(schema.maxPointsAdjusted, 0.01);
    max(schema.maxPointsAdjusted, 999);
    disabled(schema.maxPointsAdjusted, () => hasResults() || !isPointGrading());
    required(schema.gradingScaleId);
    disabled(schema.gradingScaleId, hasResults);
  });

  submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);

    if (this.testForm().valid()) {
      const value = this.testForm().value();
      this.save.emit({
        ...value,
        isPointGrading: value.isPointGrading === "true",
        gradingScaleId: Number(value.gradingScaleId),
      });
    }
  }

  private getGradingScaleIdValue(): Option<string> {
    const test = this.test();
    const gradingScaleIds = this.gradingScales().map((s) => s.Id);

    if (test) {
      // When editing, only use the test's GradingScaleId if it is part of the
      // available scales, otherwise it leads to a validation error and the user
      // has to select a valid one
      return gradingScaleIds.includes(test?.GradingScaleId ?? 0)
        ? numberToString(test?.GradingScaleId)
        : null;
    }

    // When creating, use default grading scale if available
    const defaultGradingScaleId = this.defaultGradingScaleId();
    if (
      defaultGradingScaleId &&
      gradingScaleIds.includes(defaultGradingScaleId)
    ) {
      return numberToString(defaultGradingScaleId);
    }

    // When creating but default scale is not available, use the first grading
    // scale as a fallback
    return gradingScaleIds[0] ? numberToString(gradingScaleIds[0]) : null;
  }

  private loadGradingScales(): Observable<ReadonlyArray<GradingScale>> {
    return this.loadGradingScaleIds().pipe(
      switchMap((ids) => this.gradingScalesService.getListForIds(ids)),
    );
  }

  private loadGradingScaleIds(): Observable<ReadonlyArray<number>> {
    return this.configurationsService
      .getSubscriptionDetailsDisplay()
      .pipe(map(({ testGradingScaleIds }) => testGradingScaleIds));
  }
}
