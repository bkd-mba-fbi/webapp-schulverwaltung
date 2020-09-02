import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileEntryComponent } from './my-profile-entry.component';

describe('MyProfileEntryComponent', () => {
  let component: MyProfileEntryComponent;
  let fixture: ComponentFixture<MyProfileEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyProfileEntryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
