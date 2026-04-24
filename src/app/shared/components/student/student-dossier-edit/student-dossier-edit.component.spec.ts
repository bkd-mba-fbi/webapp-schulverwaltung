import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, of } from "rxjs";
import { AdditionalInformation } from "src/app/shared/models/additional-informations.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { StudentDossierEditService } from "src/app/shared/services/student-dossier-edit.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEditComponent } from "./student-dossier-edit.component";

describe("StudentDossierEditComponent", () => {
  let component: StudentDossierEditComponent;
  let fixture: ComponentFixture<StudentDossierEditComponent>;
  let editService: jasmine.SpyObj<StudentDossierEditService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let modalService: jasmine.SpyObj<BkdModalService>;
  let router: jasmine.SpyObj<Router>;
  let additionalInformationId$: BehaviorSubject<Option<number>>;
  let additionalInformation$: BehaviorSubject<Option<AdditionalInformation>>;

  beforeEach(async () => {
    additionalInformationId$ = new BehaviorSubject<Option<number>>(null);
    additionalInformation$ = new BehaviorSubject<Option<AdditionalInformation>>(
      null,
    );
    editService = jasmine.createSpyObj(
      "StudentDossierEditService",
      ["getSubscriptionId", "save", "delete"],
      {
        loading$: of(false),
        studentId$: of(42),
        studentName$: of("Mustermann Max"),
        additionalInformationId$,
        additionalInformation$,
        categories$: of([
          {
            Key: 2000267,
            Value: "Administration",
            IsActive: true,
            Sort: "1011",
          },
          {
            Key: 2000268,
            Value: "Ärztliches Attest",
            IsActive: true,
            Sort: "1011",
          },
        ]),
      },
    );
    editService.getSubscriptionId.and.returnValue(Promise.resolve(10));
    editService.save.and.returnValue(Promise.resolve());
    editService.delete.and.returnValue(Promise.resolve());

    toastService = jasmine.createSpyObj("ToastService", ["success"]);
    modalService = jasmine.createSpyObj("BkdModalService", ["open"]);
    router = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEditComponent],
        providers: [
          { provide: ToastService, useValue: toastService },
          { provide: BkdModalService, useValue: modalService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: {} },
        ],
      }),
    )
      .overrideComponent(StudentDossierEditComponent, {
        set: {
          providers: [
            { provide: StudentDossierEditService, useValue: editService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(StudentDossierEditComponent);
    component = fixture.componentInstance;
  });

  describe("create new entry", () => {
    beforeEach(() => {
      additionalInformationId$.next(null);
      additionalInformation$.next(null);
      fixture.detectChanges();
    });

    describe("heading", () => {
      it("returns the heading for a new entry", () => {
        expect(component.heading()).toBe("student.dossier.edit.title-new");
      });
    });

    describe("form", () => {
      it("prefills form with default values", () => {
        const form = component.entryForm;
        expect(form.type().value()).toBe("document");
        expect(form.file().value()).toBeNull();
        expect(form.designation().value()).toBe("");
        expect(form.description().value()).toBe("");
        expect(form.category().value()).toBeNull();
        expect(form.forTeacher().value()).toBe("class-teacher-only");
        expect(form.forStudent().value()).toBe(true);
      });
    });

    describe("onSubmit", () => {
      it("does nothing if form is invalid", async () => {
        await component.onSubmit(new Event("submit"));
        expect(editService.save).not.toHaveBeenCalled();
        expect(toastService.success).not.toHaveBeenCalled();
      });

      describe("note", () => {
        it("saves the entry for class teacher only", async () => {
          component.entryForm.type().value.set("note");
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "note",
            {
              ObjectId: 10,
              ObjectTypeId: 2,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: null,
              ForStudent: true,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });

        it("saves the entry for all teachers", async () => {
          component.entryForm.type().value.set("note");
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          component.entryForm.forTeacher().value.set("all");
          component.entryForm.forStudent().value.set(false);
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "note",
            {
              ObjectId: 42,
              ObjectTypeId: 3,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: null,
              ForStudent: false,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });
      });

      describe("document", () => {
        it("saves the entry for class teacher only", async () => {
          const file = new File([""], "test.pdf", { type: "application/pdf" });
          component.entryForm.type().value.set("document");
          component.entryForm.file().value.set(file);
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "document",
            {
              ObjectId: 10,
              ObjectTypeId: 2,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: null,
              ForStudent: true,
            },
            file,
          );
          expect(toastService.success).toHaveBeenCalled();
        });

        it("saves the entry for all teachers", async () => {
          const file = new File([""], "test.pdf", { type: "application/pdf" });
          component.entryForm.type().value.set("document");
          component.entryForm.file().value.set(file);
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          component.entryForm.forTeacher().value.set("all");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "document",
            {
              ObjectId: 42,
              ObjectTypeId: 3,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: null,
              ForStudent: true,
            },
            file,
          );
          expect(toastService.success).toHaveBeenCalled();
        });
      });
    });
  });

  describe("edit existing entry", () => {
    let additionalInformation: AdditionalInformation;
    beforeEach(async () => {
      additionalInformation = {
        ...buildAdditionalInformation(),
        ObjectId: 42,
        ObjectTypeId: 2,
        TypeId: 1052,
        Description: "Some description",
        CodeId: 2000273,
      };
      additionalInformationId$.next(additionalInformation.Id);
      additionalInformation$.next(additionalInformation);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    describe("heading", () => {
      it("returns the heading for an existing entry", () => {
        expect(component.heading()).toBe("student.dossier.edit.title-update");
      });
    });

    describe("form", () => {
      it("prefills form with existing note entry data", () => {
        const form = component.entryForm;
        expect(form.type().value()).toBe("note");
        expect(form.designation().value()).toBe("Lorem ipsum");
        expect(form.description().value()).toBe("Some description");
        expect(form.category().value()).toBe(2000273);
        expect(form.forTeacher().value()).toBe("class-teacher-only");
        expect(form.forStudent().value()).toBe(false);
      });

      it("prefills form with existing document entry data", () => {
        additionalInformation.ObjectId = 12345;
        additionalInformation.ObjectTypeId = 3;
        additionalInformation.File = "/path/to/file.pdf";
        additionalInformation.ForStudent = true;
        additionalInformation$.next({ ...additionalInformation });
        fixture.detectChanges();

        const form = component.entryForm;
        expect(form.type().value()).toBe("document");
        expect(form.designation().value()).toBe("Lorem ipsum");
        expect(form.description().value()).toBe("Some description");
        expect(form.category().value()).toBe(2000273);
        expect(form.forTeacher().value()).toBe("all");
        expect(form.forStudent().value()).toBe(true);
      });
    });

    describe("onSubmit", () => {
      it("does nothing if form is invalid", async () => {
        component.entryForm.designation().value.set("");
        fixture.detectChanges();

        await component.onSubmit(new Event("submit"));
        expect(editService.save).not.toHaveBeenCalled();
        expect(toastService.success).not.toHaveBeenCalled();
      });

      describe("note", () => {
        it("saves the entry for class teacher only", async () => {
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "note",
            {
              Id: 1,
              ObjectId: 42,
              ObjectTypeId: 2,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: "Some description",
              ForStudent: false,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });

        it("saves the entry for all teachers", async () => {
          component.entryForm.type().value.set("note");
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          component.entryForm.forTeacher().value.set("all");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "note",
            {
              Id: 1,
              ObjectId: 42,
              ObjectTypeId: 3,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: "Some description",
              ForStudent: false,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });
      });

      describe("document", () => {
        beforeEach(() => {
          additionalInformation.File = "/path/to/file.pdf";
          additionalInformation$.next({ ...additionalInformation });
          fixture.detectChanges();
        });

        it("saves the entry for class teacher only", async () => {
          component.entryForm.type().value.set("document");
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "document",
            {
              Id: 1,
              ObjectId: 42,
              ObjectTypeId: 2,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: "Some description",
              ForStudent: false,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });

        it("saves the entry for all teachers", async () => {
          additionalInformation.ObjectId = 12345;
          additionalInformation.ObjectTypeId = 3;
          additionalInformation$.next({ ...additionalInformation });
          fixture.detectChanges();

          component.entryForm.type().value.set("document");
          component.entryForm.designation().value.set("Anruf Eltern");
          component.entryForm.category().value.set("2000267");
          component.entryForm.forTeacher().value.set("all");
          fixture.detectChanges();

          await component.onSubmit(new Event("submit"));
          expect(editService.save).toHaveBeenCalledWith(
            "document",
            {
              Id: 1,
              ObjectId: 12345,
              ObjectTypeId: 3,
              TypeId: 1052,
              CodeId: 2000267,
              Designation: "Anruf Eltern",
              Description: "Some description",
              ForStudent: false,
            },
            null,
          );
          expect(toastService.success).toHaveBeenCalled();
        });
      });
    });

    describe("delete", () => {
      it("opens confirmation dialog and deletes entry when confirmed", async () => {
        const modalRef = {
          componentInstance: {},
          result: Promise.resolve(true),
        } as NgbModalRef;
        modalService.open.and.returnValue(modalRef);

        await component.delete();

        expect(modalService.open).toHaveBeenCalled();
        expect(modalRef.componentInstance.type).toBe("note");

        await modalRef.result;
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(editService.delete).toHaveBeenCalledWith(
          additionalInformation.Id,
        );
        expect(toastService.success).toHaveBeenCalled();
      });
    });
  });
});
