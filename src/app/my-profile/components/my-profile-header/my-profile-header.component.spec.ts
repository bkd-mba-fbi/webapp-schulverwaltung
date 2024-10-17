import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReportsService } from "src/app/shared/services/reports.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyProfileHeaderComponent } from "./my-profile-header.component";

describe("MyProfileHeaderComponent", () => {
  let component: MyProfileHeaderComponent;
  let fixture: ComponentFixture<MyProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyProfileHeaderComponent],
        providers: [
          {
            provide: ReportsService,
            useValue: { personMasterDataReportUrl: "/report" },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
