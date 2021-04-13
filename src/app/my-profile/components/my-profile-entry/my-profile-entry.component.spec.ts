import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyProfileEntryComponent } from './my-profile-entry.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('MyProfileEntryComponent', () => {
  let component: MyProfileEntryComponent;
  let fixture: ComponentFixture<MyProfileEntryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [MyProfileEntryComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
