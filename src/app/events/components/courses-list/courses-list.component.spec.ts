import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { CoursesStateService } from '../../services/courses-state.service';

import { CoursesListComponent } from './courses-list.component';

describe('CoursesListComponent', () => {
  let component: CoursesListComponent;
  let fixture: ComponentFixture<CoursesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [CoursesListComponent],
        providers: [CoursesStateService],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
