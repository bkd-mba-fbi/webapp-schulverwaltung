import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSearchHeaderComponent } from './person-search-header.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { Router } from '@angular/router';

describe('PersonSearchHeaderComponent.navigateToDossier', () => {
  let component: PersonSearchHeaderComponent;
  let fixture: ComponentFixture<PersonSearchHeaderComponent>;
  // let element: HTMLElement;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ declarations: [PersonSearchHeaderComponent] }),
    ).compileComponents();

    fixture = TestBed.createComponent(PersonSearchHeaderComponent);
    component = fixture.componentInstance;
    // element = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('navigates to dossier with given id', () => {
    const key = 12;
    component.navigateToDossier(key);
    expect(router.navigate).toHaveBeenCalledWith([
      'person-search',
      'student',
      key,
      'addresses',
    ]);
  });
});
