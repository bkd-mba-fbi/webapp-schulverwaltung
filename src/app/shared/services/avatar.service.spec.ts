import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AvatarService } from "./avatar.service";
import { StorageService } from "./storage.service";

describe("AvatarService", () => {
  let service: AvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
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
    );
    service = TestBed.inject(AvatarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
