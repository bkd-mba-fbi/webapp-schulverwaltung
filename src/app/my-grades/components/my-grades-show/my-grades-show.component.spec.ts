import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGradesShowComponent } from './my-grades-show.component';
import { CoursesRestService } from '../../../shared/services/courses-rest.service';
import { StorageService } from '../../../shared/services/storage.service';

describe('MyGradesShowComponent', () => {
  let component: MyGradesShowComponent;
  let fixture: ComponentFixture<MyGradesShowComponent>;
  let coursesRestService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyGradesShowComponent],
      providers: [
        { provide: CoursesRestService, useValue: coursesRestService },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', ['getPayload']),
        },
      ],
    }).compileComponents();
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
