import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportEntryStatusComponent } from "./import-entry-status.component";

describe("ImportEntryStatusComponent", () => {
  let component: ImportEntryStatusComponent;
  let fixture: ComponentFixture<ImportEntryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEntryStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportEntryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
