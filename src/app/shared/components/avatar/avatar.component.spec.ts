import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StorageService } from "../../services/storage.service";
import { AvatarComponent } from "./avatar.component";

describe("AvatarComponent", () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [AvatarComponent],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken(): string {
                return "asdf";
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  describe(".avatarStyles", () => {
    it("is set to styles object", () => {
      fixture.componentRef.setInput("studentId", 123);
      fixture.detectChanges();

      expect(component.avatarStyles()).toEqual({
        "background-image":
          "url(https://eventotest.api/Files/personPictures/123?token=asdf), url(./assets/images/avatar-placeholder.png)",
      });
    });
  });
});
