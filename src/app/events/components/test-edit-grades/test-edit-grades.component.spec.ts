import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';
import { EventsStateService } from '../../services/events-state.service';
import { CoursesRestService } from '../../../shared/services/courses-rest.service';
import { StorageService } from '../../../shared/services/storage.service';

describe('TestEditGradesComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;
  let storageServiceMock: StorageService;

  beforeEach(
    waitForAsync(() => {
      storageServiceMock = jasmine.createSpyObj('StorageService', [
        'getPayload',
      ]);

      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestEditGradesComponent],
          providers: [
            CoursesRestService,
            EventsStateService,
            {
              provide: StorageService,
              useValue: storageServiceMock,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;

    component.course = buildCourse(1);
    component.tests = [buildTest(1, 12, [])];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
