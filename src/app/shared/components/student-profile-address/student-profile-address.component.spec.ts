import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileAddressComponent } from './student-profile-address.component';
import { buildStudent } from 'src/spec-builders';

describe('StudentProfileAddressComponent', () => {
  let component: StudentProfileAddressComponent;
  let fixture: ComponentFixture<StudentProfileAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentProfileAddressComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileAddressComponent);
    component = fixture.componentInstance;
    component.student = buildStudent(123);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
