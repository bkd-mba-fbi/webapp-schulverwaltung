import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SortableHeaderComponent } from "./sortable-header.component";

describe("SortableHeaderComponent", () => {
  let fixture: ComponentFixture<SortableHeaderComponent<string>>;
  let element: HTMLElement;
  let component: SortableHeaderComponent<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortableHeaderComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    fixture.componentRef.setInput("label", "Test Column");
    fixture.componentRef.setInput("sortKey", "test");
    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "test",
      ascending: true,
    });
    fixture.detectChanges();
  });

  it("should update sort criteria when button is clicked", () => {
    element.querySelector("button")?.click();
    expect(component.sortCriteria()).toEqual({
      primarySortKey: "test",
      ascending: false,
    });
    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "otherKey",
      ascending: true,
    });
    fixture.detectChanges();
    element.querySelector("button")?.click();
    expect(component.sortCriteria()).toEqual({
      primarySortKey: "test",
      ascending: true,
    });
  });

  it("should display the correct label", () => {
    fixture.detectChanges();
    expect(element.textContent).toContain("Test Column");
  });

  it("should display sorting character when sorted on this key", () => {
    fixture.detectChanges();
    const sortSpan = element.querySelector(".sort-direction");
    expect(sortSpan).not.toBeNull();
    expect(element.textContent).toContain("↓");
    element.querySelector("button")?.click();
    fixture.detectChanges();
    expect(element.textContent).toContain("↑");
  });

  it("should not display sorting character when sorted on a different key", () => {
    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "otherKey",
      ascending: true,
    });
    fixture.detectChanges();
    const sortSpan = element.querySelector(".sort-direction");
    expect(sortSpan).toBeNull();
  });
});
