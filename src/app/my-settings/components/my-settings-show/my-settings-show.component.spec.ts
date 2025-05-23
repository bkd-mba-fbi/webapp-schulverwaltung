import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MySettingsShowComponent } from "./my-settings-show.component";

describe("MySettingsShowComponent", () => {
  let component: MySettingsShowComponent;
  let fixture: ComponentFixture<MySettingsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MySettingsShowComponent],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload(): Dict<unknown> {
                return { id_person: "123" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
