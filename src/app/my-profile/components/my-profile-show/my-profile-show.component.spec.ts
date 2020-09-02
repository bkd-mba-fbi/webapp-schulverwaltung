import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileShowComponent } from './my-profile-show.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { MyProfileService } from '../../services/my-profile.service';

describe('MyProfileShowComponent', () => {
  let component: MyProfileShowComponent;
  let fixture: ComponentFixture<MyProfileShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyProfileShowComponent],
        providers: [MyProfileService],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
