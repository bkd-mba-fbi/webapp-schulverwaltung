import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiKeyValueComponent } from "./api-key-value.component";

describe("ApiKeyValueComponent", () => {
  let component: ApiKeyValueComponent;
  let fixture: ComponentFixture<ApiKeyValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiKeyValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
