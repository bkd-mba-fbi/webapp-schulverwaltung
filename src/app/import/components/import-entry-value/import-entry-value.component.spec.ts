import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportEntryValueComponent } from "./import-entry-value.component";

describe("ImportEntryValueComponent", () => {
  let component: ImportEntryValueComponent;
  let fixture: ComponentFixture<ImportEntryValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEntryValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportEntryValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
