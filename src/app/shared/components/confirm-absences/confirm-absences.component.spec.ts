import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { OpenAbsencesService } from "src/app/open-absences/services/open-absences.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ConfirmAbsencesSelectionService } from "../../services/confirm-absences-selection.service";
import { ConfirmAbsencesComponent } from "./confirm-absences.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("ConfirmAbsencesComponent", () => {
  let component: ConfirmAbsencesComponent;
  let fixture: ComponentFixture<ConfirmAbsencesComponent>;
  let storeMock: any;

  beforeEach(waitForAsync(() => {
    storeMock = {};
    spyOn(localStorage, "getItem").and.callFake(
      (key: string) => storeMock[key] || null,
    );
    spyOn(localStorage, "setItem").and.callFake(
      (key: string) => storeMock[key] || null,
    );

    storeMock["CLX.LoginToken"] =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA";

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [ConfirmAbsencesComponent],
        providers: [
          OpenAbsencesService,
          ConfirmAbsencesSelectionService,
          {
            provide: Router,
            useValue: jasmine.createSpyObj("Router", ["navigate"]),
          },
          {
            provide: ActivatedRoute,
            useValue: {
              root(): any {
                return {};
              },
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    storeMock["CLX.LoginToken"] =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA";
    expect(component).toBeTruthy();
  });
});
