import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileEntryHeaderComponent } from './student-profile-entry-header.component';

describe('StudentProfileEntryHeaderComponent', () => {
  let component: StudentProfileEntryHeaderComponent;
  let fixture: ComponentFixture<StudentProfileEntryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentProfileEntryHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileEntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
