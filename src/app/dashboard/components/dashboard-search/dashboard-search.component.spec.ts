import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DashboardSearchComponent } from './dashboard-search.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('DashboardSearchComponent', () => {
  let component: DashboardSearchComponent;
  let fixture: ComponentFixture<DashboardSearchComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardSearchComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to dossier with given id', () => {
    const key = 12;
    component.navigateToDossier(key);
    expect(router.navigate).toHaveBeenCalledWith([
      'dashboard',
      'student',
      key,
      'addresses',
    ]);
  });
});
