import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateModule } from "@ngx-translate/core";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { RestAuthInterceptor } from "../rest-auth-interceptor";
import { RestErrorInterceptor } from "../rest-error-interceptor";
import { RestRoleInterceptor } from "../rest-role-interceptor";
import { AvatarComponent } from "./components/avatar/avatar.component";
import { BacklinkComponent } from "./components/backlink/backlink.component";
import { CaretComponent } from "./components/caret/caret.component";
import { ConfirmAbsencesComponent } from "./components/confirm-absences/confirm-absences.component";
import { DateSelectComponent } from "./components/date-select/date-select.component";
import { MultiselectComponent } from "./components/multiselect/multiselect.component";
import { ReportsLinkComponent } from "./components/reports-link/reports-link.component";
import { ResettableInputComponent } from "./components/resettable-input/resettable-input.component";
import { SelectComponent } from "./components/select/select.component";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { DossierAbsencesComponent } from "./components/student-dossier/dossier-absences/dossier-absences.component";
import { DossierAddressesComponent } from "./components/student-dossier/dossier-addresses/dossier-addresses.component";
import { DossierCourseTestsComponent } from "./components/student-dossier/dossier-course-tests/dossier-course-tests.component";
import { DossierGradesCourseHeaderComponent } from "./components/student-dossier/dossier-grades-course-header/dossier-grades-course-header.component";
import { DossierGradesEditComponent } from "./components/student-dossier/dossier-grades-edit/dossier-grades-edit.component";
import { DossierGradesFinalGradeComponent } from "./components/student-dossier/dossier-grades-final-grade/dossier-grades-final-grade.component";
import { DossierGradesViewComponent } from "./components/student-dossier/dossier-grades-view/dossier-grades-view.component";
import { DossierGradesComponent } from "./components/student-dossier/dossier-grades/dossier-grades.component";
import { DossierSingleTestComponent } from "./components/student-dossier/dossier-single-test/dossier-single-test.component";
import { StudentBacklinkComponent } from "./components/student-dossier/student-backlink/student-backlink.component";
import { StudentDossierAbsencesComponent } from "./components/student-dossier/student-dossier-absences/student-dossier-absences.component";
import { StudentDossierAddressComponent } from "./components/student-dossier/student-dossier-address/student-dossier-address.component";
import { StudentDossierApprenticeshipCompanyComponent } from "./components/student-dossier/student-dossier-apprenticeship-company/student-dossier-apprenticeship-company.component";
import { StudentDossierEntryHeaderComponent } from "./components/student-dossier/student-dossier-entry-header/student-dossier-entry-header.component";
import { StudentDossierLegalRepresentativeComponent } from "./components/student-dossier/student-dossier-legal-representative/student-dossier-legal-representative.component";
import { StudentDossierComponent } from "./components/student-dossier/student-dossier/student-dossier.component";
import { SwitchComponent } from "./components/switch/switch.component";
import { PreserveLineHeightComponent } from "./components/text/line/preserve-line-height.component";
import { ToastComponent } from "./components/toast/toast.component";
import { TypeaheadComponent } from "./components/typeahead/typeahead.component";
import { LetDirective } from "./directives/let.directive";
import { AddSpacePipe } from "./pipes/add-space.pipe";
import { DaysDifferencePipe } from "./pipes/days-difference.pipe";
import { DecimalOrDashPipe } from "./pipes/decimal-or-dash.pipe";
import { PersonEmailPipe } from "./pipes/person-email.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { TestPointsPipe } from "./pipes/test-points.pipe";
import { TestsWeightPipe } from "./pipes/test-weight.pipe";
import { XssPipe } from "./pipes/xss.pipe";

const directives = [LetDirective];

const components = [
  AvatarComponent,
  BacklinkComponent,
  CaretComponent,
  ConfirmAbsencesComponent,
  DateSelectComponent,
  DossierAbsencesComponent,
  DossierAddressesComponent,
  DossierCourseTestsComponent,
  DossierGradesComponent,
  DossierGradesCourseHeaderComponent,
  DossierGradesEditComponent,
  DossierGradesFinalGradeComponent,
  DossierGradesViewComponent,
  DossierSingleTestComponent,
  MultiselectComponent,
  PreserveLineHeightComponent,
  ReportsLinkComponent,
  ResettableInputComponent,
  SelectComponent,
  SpinnerComponent,
  StudentBacklinkComponent,
  StudentDossierAbsencesComponent,
  StudentDossierAddressComponent,
  StudentDossierApprenticeshipCompanyComponent,
  StudentDossierComponent,
  StudentDossierEntryHeaderComponent,
  StudentDossierLegalRepresentativeComponent,
  SwitchComponent,
  ToastComponent,
  TypeaheadComponent,
];

const pipes = [
  AddSpacePipe,
  DaysDifferencePipe,
  DecimalOrDashPipe,
  PersonEmailPipe,
  SafePipe,
  TestPointsPipe,
  TestsWeightPipe,
  XssPipe,
];

@NgModule({
  declarations: [...directives, ...components, ...pipes],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RestErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestRoleInterceptor, multi: true },
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ...directives,
    ...components,
    ...pipes,
  ],
})
export class SharedModule {}
