import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LetDirective } from './directives/let.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RestAuthInterceptor } from '../rest-auth-interceptor';
import { RestErrorInterceptor } from '../rest-error-interceptor';
import { RestRoleInterceptor } from '../rest-role-interceptor';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { DateSelectComponent } from './components/date-select/date-select.component';
import { SelectComponent } from './components/select/select.component';
import { StudentBacklinkComponent } from './components/student-dossier/student-backlink/student-backlink.component';
import { StudentDossierComponent } from './components/student-dossier/student-dossier/student-dossier.component';
import { StudentDossierEntryHeaderComponent } from './components/student-dossier/student-dossier-entry-header/student-dossier-entry-header.component';
import { StudentDossierAddressComponent } from './components/student-dossier/student-dossier-address/student-dossier-address.component';
import { StudentDossierLegalRepresentativeComponent } from './components/student-dossier/student-dossier-legal-representative/student-dossier-legal-representative.component';
import { StudentDossierApprenticeshipCompanyComponent } from './components/student-dossier/student-dossier-apprenticeship-company/student-dossier-apprenticeship-company.component';
import { StudentDossierAbsencesComponent } from './components/student-dossier/student-dossier-absences/student-dossier-absences.component';
import { ConfirmAbsencesComponent } from './components/confirm-absences/confirm-absences.component';
import { PersonEmailPipe } from './pipes/person-email.pipe';
import { DaysDifferencePipe } from './pipes/days-difference.pipe';
import { ResettableInputComponent } from './components/resettable-input/resettable-input.component';
import { SafePipe } from './pipes/safe.pipe';
import { XssPipe } from './pipes/xss.pipe';
import { AddSpacePipe } from './pipes/add-space.pipe';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TestsWeightPipe } from './pipes/test-weight.pipe';
import { TestsGradingTypePipe } from './pipes/test-grading-type.pipe';
import { PreserveLineHeightComponent } from './components/text/line/preserve-line-height.component';
import { DossierAbsencesComponent } from './components/student-dossier/dossier-absences/dossier-absences.component';
import { DossierOverviewComponent } from './components/student-dossier/dossier-overview/dossier-overview.component';
import { DossierAddressesComponent } from './components/student-dossier/dossier-addresses/dossier-addresses.component';
import { DossierGradesComponent } from './components/student-dossier/dossier-grades/dossier-grades.component';
import { DossierCourseTestsComponent } from './components/student-dossier/dossier-course-tests/dossier-course-tests.component';
import { DossierGradesViewComponent } from './components/student-dossier/dossier-grades-view/dossier-grades-view.component';
import { DossierGradesFinalGradeComponent } from './components/student-dossier/dossier-grades-final-grade/dossier-grades-final-grade.component';
import { DossierSingleTestComponent } from './components/student-dossier/dossier-single-test/dossier-single-test.component';

// Components that will be exported
const components = [
  LetDirective,
  SpinnerComponent,
  AvatarComponent,
  TypeaheadComponent,
  DateSelectComponent,
  SelectComponent,
  MultiselectComponent,
  DossierOverviewComponent,
  DossierAddressesComponent,
  DossierAbsencesComponent,
  StudentBacklinkComponent,
  StudentDossierComponent,
  StudentDossierEntryHeaderComponent,
  StudentDossierAddressComponent,
  StudentDossierLegalRepresentativeComponent,
  StudentDossierApprenticeshipCompanyComponent,
  StudentDossierAbsencesComponent,
  ConfirmAbsencesComponent,
  PersonEmailPipe,
  DaysDifferencePipe,
  SafePipe,
  XssPipe,
  AddSpacePipe,
  TestsWeightPipe,
  TestsGradingTypePipe,
  PreserveLineHeightComponent,
];

@NgModule({
  declarations: [
    ...components,
    ResettableInputComponent,
    SafePipe,
    XssPipe,
    AddSpacePipe,
    MultiselectComponent,
    DossierAbsencesComponent,
    DossierAddressesComponent,
    DossierGradesComponent,
    DossierCourseTestsComponent,
    DossierGradesViewComponent,
    DossierGradesFinalGradeComponent,
    DossierSingleTestComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RestErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestRoleInterceptor, multi: true },
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forChild(),
    NgbModule,
    InfiniteScrollModule,
    NgSelectModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    NgbModule,
    InfiniteScrollModule,
    ...components,
    ResettableInputComponent,
    NgSelectModule,
  ],
})
export class SharedModule {}
