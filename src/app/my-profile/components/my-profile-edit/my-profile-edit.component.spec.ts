import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildPerson } from 'src/spec-builders';
import { MyProfileEditComponent } from './my-profile-edit.component';
import { MyProfileService } from '../../services/my-profile.service';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';

describe('MyProfileEditComponent', () => {
  // let component: MyProfileEditComponent;
  let fixture: ComponentFixture<MyProfileEditComponent>;
  let element: HTMLElement;
  let profileService: MyProfileService;
  let personsService: jasmine.SpyObj<PersonsRestService>;

  beforeEach(waitForAsync(() => {
    const person = buildPerson(123);
    person.AddressLine1 = 'Postfach';
    person.AddressLine2 = 'Industriegasse 123';
    person.Zip = '3000';
    person.Location = 'Bern';
    person.PhonePrivate = '+41 31 123 45 67';
    person.PhoneMobile = '+41 79 123 45 67';
    person.Email2 = 'john@example.com';

    profileService = {
      profile$: of({
        student: person,
        legalRepresentativePersons: [],
        apprenticeshipCompanies: [],
      }),
      loading$: of(false),
      reset: jasmine.createSpy('reset'),
    } as unknown as MyProfileService;

    personsService = jasmine.createSpyObj('PersonsRestService', ['update']);
    personsService.update.and.returnValue(of());

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyProfileEditComponent],
        providers: [
          { provide: MyProfileService, useValue: profileService },
          { provide: PersonsRestService, useValue: personsService },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEditComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('renders address', () => {
    expect(element.querySelector('address')?.textContent).toBe(
      'Postfach Industriegasse 123 3000 Bern',
    );
  });

  it('renders form fields with current values', () => {
    expect(getInput('phonePrivate').value).toBe('+41 31 123 45 67');
    expect(getInput('phoneMobile').value).toBe('+41 79 123 45 67');
    expect(getInput('email2').value).toBe('john@example.com');
  });

  it('validates email address', () => {
    expect(element.querySelector('.invalid-feedback')).toBeNull();

    changeValue('email2', 'john');
    expect(element.querySelector('.invalid-feedback')).toBeNull();

    clickSubmitButton();
    expect(element.querySelector('.invalid-feedback')).not.toBeNull();
    expect(personsService.update).not.toHaveBeenCalled();

    changeValue('email2', 'jane');
    expect(element.querySelector('.invalid-feedback')).not.toBeNull();

    changeValue('email2', 'jane@example.com');
    expect(element.querySelector('.invalid-feedback')).toBeNull();

    clickSubmitButton();
    expect(element.querySelector('.invalid-feedback')).toBeNull();
    expect(personsService.update).toHaveBeenCalled();
  });

  it('updates person on submit and redirects back to profile', () => {
    changeValue('phonePrivate', '+41 31 987 65 54');
    changeValue('phoneMobile', '+41 79 987 65 54');
    changeValue('email2', 'jane@example.com');
    clickSubmitButton();

    expect(element.querySelector('.invalid-feedback')).toBeNull();
    expect(personsService.update).toHaveBeenCalledWith(
      123,
      '+41 31 987 65 54',
      '+41 79 987 65 54',
      'jane@example.com',
    );
  });

  it('updates person with empty values on submit', () => {
    changeValue('phonePrivate', '');
    changeValue('phoneMobile', '');
    changeValue('email2', '');
    clickSubmitButton();

    expect(element.querySelector('.invalid-feedback')).toBeNull();
    expect(personsService.update).toHaveBeenCalledWith(123, null, null, null);
  });

  function getInput(name: string): HTMLInputElement {
    const field = element.querySelector(`input[formcontrolname="${name}"]`);
    expect(field).not.toBeNull();
    return field as HTMLInputElement;
  }

  function changeValue(name: string, value: string): void {
    const input = getInput(name);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function clickSubmitButton(): void {
    const button = element.querySelector(
      '.btn-primary',
    ) as Option<HTMLButtonElement>;
    if (button) {
      button.click();
      fixture.detectChanges();
    }
  }
});
