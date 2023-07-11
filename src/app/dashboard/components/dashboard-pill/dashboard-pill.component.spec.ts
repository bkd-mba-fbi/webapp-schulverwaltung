import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPillComponent } from './dashboard-pill.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('DashboardPillComponent', () => {
  let component: DashboardPillComponent;
  let fixture: ComponentFixture<DashboardPillComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DashboardPillComponent],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardPillComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it('should render the component', () => {
    component.count = 33;
    fixture.detectChanges();
    expect(element.textContent).toContain('dashboard.actions.deadline: 33');
  });
});
