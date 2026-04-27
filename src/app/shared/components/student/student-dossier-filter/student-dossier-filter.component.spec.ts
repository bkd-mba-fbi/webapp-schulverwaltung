import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { DropDownGroupedItem } from "src/app/shared/models/drop-down-grouped-item.model";
import { StudentDossierFilterService } from "src/app/shared/services/student-dossier-filter.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierFilterComponent } from "./student-dossier-filter.component";

describe("StudentDossierFilterComponent", () => {
  let component: StudentDossierFilterComponent;
  let fixture: ComponentFixture<StudentDossierFilterComponent>;
  let element: HTMLElement;

  let filterOptions$: BehaviorSubject<ReadonlyArray<DropDownGroupedItem>>;
  let selectedCategories$: BehaviorSubject<ReadonlyArray<string>>;
  let isFilterActive$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    filterOptions$ = new BehaviorSubject<ReadonlyArray<DropDownGroupedItem>>([
      { Value: "Zeugnis", Key: 1, Group: "shared.multiselect.all-option" },
      { Value: "Gesuch", Key: 2, Group: "shared.multiselect.all-option" },
    ]);
    selectedCategories$ = new BehaviorSubject<ReadonlyArray<string>>([]);
    isFilterActive$ = new BehaviorSubject<boolean>(false);

    const filterServiceMock = {
      filterOptions$,
      selectedCategories$,
      isFilterActive$,
    };

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierFilterComponent],
        providers: [
          {
            provide: StudentDossierFilterService,
            useValue: filterServiceMock,
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierFilterComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("creates the component", () => {
    expect(component).toBeTruthy();
  });

  it("toggles the dropdown when clicking the button", () => {
    expect(component.isDropdownOpen()).toBe(false);

    const button = element.querySelector<HTMLButtonElement>("button")!;
    button.click();
    fixture.detectChanges();
    expect(component.isDropdownOpen()).toBe(true);

    button.click();
    fixture.detectChanges();
    expect(component.isDropdownOpen()).toBe(false);
  });

  it("shows an icon when the filter is active", () => {
    expect(element.querySelector(".filter-active")).toBeNull();

    isFilterActive$.next(true);
    fixture.detectChanges();

    expect(element.querySelector(".filter-active")).not.toBeNull();
  });

  it("renders the available options when the dropdown is open", () => {
    component.toggleDropdown();
    fixture.detectChanges();

    const text = element.textContent ?? "";
    expect(text).toContain("shared.multiselect.all-option");
    expect(text).toContain("Zeugnis");
    expect(text).toContain("Gesuch");
  });
});
