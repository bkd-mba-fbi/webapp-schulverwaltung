import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SortableHeaderComponent } from "./sortable-header.component";

describe("SortableHeaderComponent", () => {
  let component: SortableHeaderComponent<string>;
  let fixture: ComponentFixture<SortableHeaderComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortableHeaderComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
