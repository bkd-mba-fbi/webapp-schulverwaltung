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

  it("should call toggleSort when clicked", () => {
    spyOn(component, "toggleSort").and.callThrough();
    element.querySelector("button")?.dispatchEvent(new Event("click"));
    expect(component.toggleSort).toHaveBeenCalled();
  });

  it("should display the correct label", () => {
    fixture.detectChanges();
    expect(element.textContent).toContain("Test Column");
  });

  it("should display sorting character when sorted on this key", () => {
    fixture.detectChanges();
    const sortSpan = element.querySelector(".sort-direction");
    expect(sortSpan).not.toBeNull();
    expect(sortSpan?.textContent).toBe("↓");
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
