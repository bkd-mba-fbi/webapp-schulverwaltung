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
import { FormErrorsComponent } from "src/app/shared/components/form-errors/form-errors.component";
import { SubmitButtonComponent } from "src/app/shared/components/submit-button/submit-button.component";
import { Test } from "src/app/shared/models/test.model";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { TestStateService } from "../../../services/test-state.service";

interface TestFormData {
  designation: string;
  date: Date;
  weight: number;
  isPointGrading: "true" | "false";
  maxPoints: Option<number>;
  maxPointsAdjusted: Option<number>;
}

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

  test = input<Option<Test>>(null);
  saving = input(false);
  save = output<
    Omit<TestFormData, "isPointGrading"> & { isPointGrading: boolean }
  >();

  componentId = uniqueId("bkd-tests-edit-form");

  courseId$ = this.testStateService.courseId$;

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
  });

  submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);

    if (this.testForm().valid()) {
      const value = this.testForm().value();
      this.save.emit({
        ...value,
        isPointGrading: value.isPointGrading === "true",
      });
    }
  }
}
