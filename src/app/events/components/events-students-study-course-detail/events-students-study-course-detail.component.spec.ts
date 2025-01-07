import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Person } from "src/app/shared/models/person.model";
import {
  Subscription,
  SubscriptionDetail,
} from "src/app/shared/models/subscription.model";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import {
  buildPerson,
  buildSubscription,
  buildSubscriptionDetail,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { EventsStudentsStudyCourseDetailComponent } from "./events-students-study-course-detail.component";

describe("EventsStudentsStudyCourseDetailComponent", () => {
  let fixture: ComponentFixture<EventsStudentsStudyCourseDetailComponent>;
  let element: HTMLElement;
  let personsServiceMock: jasmine.SpyObj<PersonsRestService>;
  let subscriptionsServiceMock: jasmine.SpyObj<SubscriptionsRestService>;
  let person: Person;
  let subscription: Subscription;
  let details: ReadonlyArray<SubscriptionDetail>;

  beforeEach(async () => {
    person = buildPerson(42);
    person.FullName = "Lennon John";
    person.Birthdate = new Date(1970, 0, 1);
    person.Gender = "F";
    person.AddressLine1 = "3 Abbey Road";
    person.Zip = "NW8 9AY";
    person.Location = "London";
    person.PhonePrivate = "031 123 45 67";
    person.PhoneMobile = "079 123 45 67";

    subscription = buildSubscription(100, 1, 42);
    subscription.Status = "Aufgenommen";

    details = [];

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsStudyCourseDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of(new Map([["id", "42"]])),
              parent: {
                paramMap: of(new Map([["id", "1"]])),
              },
              queryParams: of({ returnparams: "foo=bar&baz=123" }),
            },
          },
          {
            provide: PersonsRestService,
            useFactory() {
              personsServiceMock = jasmine.createSpyObj("PersonsRestService", [
                "get",
              ]);
              personsServiceMock.get.and.callFake(() => of(person));
              return personsServiceMock;
            },
          },
          {
            provide: SubscriptionsRestService,
            useFactory() {
              subscriptionsServiceMock = jasmine.createSpyObj("", [
                "getSubscriptionsByCourse",
                "getSubscriptionDetailsById",
              ]);
              subscriptionsServiceMock.getSubscriptionsByCourse.and.callFake(
                () => of([subscription]),
              );
              subscriptionsServiceMock.getSubscriptionDetailsById.and.callFake(
                () => of(details),
              );
              return subscriptionsServiceMock;
            },
          },
          {
            provide: StorageService,
            useValue: { getAccessToken: () => "eyABCDEFG" },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsStudyCourseDetailComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("fetches & renders person data", () => {
    fixture.detectChanges();
    expect(personsServiceMock.get).toHaveBeenCalledWith(42);
    expect(element.querySelector("h1")?.textContent).toContain("Lennon John");
    expect(element.textContent).toContain("01.01.1970");
    expect(element.textContent).toContain("(F)");
    expect(element.textContent).toContain("3 Abbey Road");
    expect(element.textContent).toContain("NW8 9AY");
    expect(element.textContent).toContain("London");
    expect(element.textContent).toContain("031 123 45 67");
    expect(element.textContent).toContain("079 123 45 67");
  });

  it("fetches & renders subscription status", () => {
    fixture.detectChanges();
    expect(
      subscriptionsServiceMock.getSubscriptionsByCourse,
    ).toHaveBeenCalledWith(1, { "filter.PersonId": "=42" });
    expect(element.textContent).toContain("Aufgenommen");
  });

  describe("subscription details", () => {
    it("fetches & renders text entries", () => {
      const detail1 = buildSubscriptionDetail(1001, "Lorem ipsum");
      detail1.Id = "1001";
      detail1.VssDesignation = "Bemerkung";

      const detail2 = buildSubscriptionDetail(1002, "2401");
      detail2.Id = "1002";
      detail2.VssDesignation = "Eintritt in Semester";

      details = [detail1, detail2];

      fixture.detectChanges();
      expect(
        subscriptionsServiceMock.getSubscriptionDetailsById,
      ).toHaveBeenCalledWith(100);
      expect(element.textContent).toContain("Bemerkung");
      expect(element.textContent).toContain("Lorem ipsum");
      expect(element.textContent).toContain("Eintritt in Semester");
      expect(element.textContent).toContain("2401");
    });

    it("renders isYes entries", () => {
      const detail1 = buildSubscriptionDetail(1001, "Ja");
      detail1.Id = "1001";
      detail1.VssDesignation = "Vegetarische Ernährung";
      detail1.VssType = "isYes";

      const detail2 = buildSubscriptionDetail(1002, "Nein");
      detail2.Id = "1002";
      detail2.VssDesignation = "Halbtax";
      detail2.VssType = "isYes";

      details = [detail1, detail2];

      fixture.detectChanges();
      expect(element.textContent).toContain("Vegetarische Ernährung");
      expect(element.textContent).toContain("Ja");
      expect(element.textContent).toContain("Halbtax");
      expect(element.textContent).toContain("Nein");
    });

    it("renders isYesNo entries", () => {
      const detail1 = buildSubscriptionDetail(1001, "Ja");
      detail1.Id = "1001";
      detail1.VssDesignation = "Vegetarische Ernährung";
      detail1.VssType = "isYesNo";

      const detail2 = buildSubscriptionDetail(1002, "Nein");
      detail2.Id = "1002";
      detail2.VssDesignation = "Halbtax";
      detail2.VssType = "isYesNo";

      details = [detail1, detail2];

      fixture.detectChanges();
      expect(element.textContent).toContain("Vegetarische Ernährung");
      expect(element.textContent).toContain("Ja");
      expect(element.textContent).toContain("Halbtax");
      expect(element.textContent).toContain("Nein");
    });

    it("renders dropdown entries", () => {
      const detail1 = buildSubscriptionDetail(1001, "1234");
      detail1.Id = "1001";
      detail1.VssDesignation = "Lieblingsfarbe";
      detail1.DropdownItems = [
        { Key: "1234", Value: "salmon" },
        { Key: "5678", Value: "gold" },
      ];

      const detail2 = buildSubscriptionDetail(1002, "Spaghetti Bolo");
      detail2.Id = "1002";
      detail2.VssDesignation = "Lieblingsessen";
      detail2.DropdownItems = [
        { Key: "1234", Value: "Pizza" },
        { Key: "5678", Value: "Lasagne" },
      ];
      detail2.VssStyle = "CB";

      details = [detail1, detail2];

      fixture.detectChanges();
      expect(element.textContent).toContain("Lieblingsfarbe");
      expect(element.textContent).toContain("salmon");
      expect(element.textContent).toContain("Lieblingsessen");
      expect(element.textContent).toContain("Spaghetti Bolo");
    });

    it("renders document file entry", () => {
      const detail = buildSubscriptionDetail(1001, "document.pdf");
      detail.Id = "1001";
      detail.VssDesignation = "Upload PDF-Datei 1";
      detail.VssStyle = "PD";
      details = [detail];

      fixture.detectChanges();
      expect(element.textContent).toContain("Upload PDF-Datei 1");
      const link = element.querySelector(
        "a[href='https://eventotest.api/Files/SubscriptionDetails/1001?token=eyABCDEFG']",
      );
      expect(link).not.toBeNull();
      expect(link?.textContent).toBe("document.pdf");
    });

    it("renders foto file entry", () => {
      const detail = buildSubscriptionDetail(1002, "foto.jpg");
      detail.Id = "1002";
      detail.VssDesignation = "Upload Foto";
      detail.VssStyle = "PF";
      details = [detail];

      fixture.detectChanges();
      expect(element.textContent).toContain("Upload Foto");
      const link = element.querySelector(
        "a[href='https://eventotest.api/Files/SubscriptionDetails/1002?token=eyABCDEFG']",
      );
      expect(link).not.toBeNull();
      expect(link?.textContent).toBe("foto.jpg");
    });
  });
});
