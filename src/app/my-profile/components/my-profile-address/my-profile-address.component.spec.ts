import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MyProfileAddressComponent } from "./my-profile-address.component";

describe("MyProfileAddressComponent", () => {
  let component: MyProfileAddressComponent;
  let fixture: ComponentFixture<MyProfileAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyProfileAddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
