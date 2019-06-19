import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAbsencesListComponent } from './open-absences-list.component';

describe('OpenAbsencesListComponent', () => {
  let component: OpenAbsencesListComponent;
  let fixture: ComponentFixture<OpenAbsencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenAbsencesListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
