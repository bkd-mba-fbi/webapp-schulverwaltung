import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ImportTypeComponent } from "./import-type.component";

describe("ImportTypeComponent", () => {
  let component: ImportTypeComponent;
  let fixture: ComponentFixture<ImportTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
