import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentProfileAddressComponent } from './student-profile-address.component';
import { buildStudent, buildPerson } from 'src/spec-builders';
import { Person } from '../../models/person.model';

describe('StudentProfileAddressComponent', () => {
  let component: StudentProfileAddressComponent;
  let fixture: ComponentFixture<StudentProfileAddressComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StudentProfileAddressComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileAddressComponent);
    component = fixture.componentInstance;
  });

  describe('for student', () => {
    beforeEach(() => {
      component.student = buildStudent(123);
      component.student.AddressLine1 = 'Spitalgasse 1';
      component.student.PostalCode = '3000';
      component.student.Location = 'Bern';
      component.student.PhoneMobile = '+41 79 123 45 67';
    });

    it('renders full address', () => {
      component.student.AddressLine2 = 'Postfach';
      component.student.PhonePrivate = '+41 31 123 45 67';
      component.student.DisplayEmail = 'fritz@example.com';

      fixture.detectChanges();
      expectText(
        'Spitalgasse 1 Postfach 3000 Bern +41 31 123 45 67 +41 79 123 45 67 fritz@example.com'
      );
    });

    it('renders address without optional fields', () => {
      fixture.detectChanges();
      expectText('Spitalgasse 1 3000 Bern +41 79 123 45 67');
    });
  });

  describe('for person', () => {
    beforeEach(() => {
      component.student = buildPerson(123);
      component.student.AddressLine1 = 'Spitalgasse 1';
      component.student.Zip = '3000';
      component.student.Location = 'Bern';
      component.student.PhoneMobile = '+41 79 123 45 67';
    });

    it('renders full address', () => {
      component.student.AddressLine2 = 'Postfach';
      component.student.PhonePrivate = '+41 31 123 45 67';
      component.student.DisplayEmail = 'fritz@example.com';

      fixture.detectChanges();
      expectText(
        'Spitalgasse 1 Postfach 3000 Bern +41 31 123 45 67 +41 79 123 45 67 fritz@example.com'
      );
    });

    it('renders address without optional fields', () => {
      fixture.detectChanges();
      expectText('Spitalgasse 1 3000 Bern +41 79 123 45 67');
    });

    it('renders alternative email', () => {
      component.student.DisplayEmail = 'fritz@example.com';
      (component.student as Person).Email2 = 'alternative@example.com';
      component.emailProperty = 'Email2';
      fixture.detectChanges();

      expectText(
        'Spitalgasse 1 3000 Bern +41 79 123 45 67 alternative@example.com'
      );
    });
  });

  function expectText(expectedText: string): void {
    const text = fixture.elementRef.nativeElement.textContent
      .trim()
      .replace(/\s{2,}/g, ' ');
    expect(text).toBe(expectedText);
  }
});
