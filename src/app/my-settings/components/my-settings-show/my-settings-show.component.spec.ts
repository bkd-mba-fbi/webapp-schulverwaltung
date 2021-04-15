import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySettingsShowComponent } from './my-settings-show.component';

describe('MySettingsShowComponent', () => {
  let component: MySettingsShowComponent;
  let fixture: ComponentFixture<MySettingsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySettingsShowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
