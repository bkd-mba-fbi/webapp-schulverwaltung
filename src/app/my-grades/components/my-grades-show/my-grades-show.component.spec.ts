import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGradesShowComponent } from './my-grades-show.component';
import { StorageService } from '../../../shared/services/storage.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MyGradesService } from '../../services/my-grades.service';
import { of } from 'rxjs';
import { MyGradesHeaderComponent } from '../my-grades-header/my-grades-header.component';

describe('MyGradesShowComponent', () => {
  let component: MyGradesShowComponent;
  let fixture: ComponentFixture<MyGradesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyGradesShowComponent, MyGradesHeaderComponent],
        providers: [
          {
            provide: MyGradesService,
            useValue: {
              studentId$: of(1),
              studentCourses$: of([]),
            },
          },
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj('StorageService', ['getPayload']),
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
