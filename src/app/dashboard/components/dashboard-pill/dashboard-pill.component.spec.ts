import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPillComponent } from './dashboard-pill.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('DashboardPillComponent', () => {
  let component: DashboardPillComponent;
  let fixture: ComponentFixture<DashboardPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardPillComponent],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
