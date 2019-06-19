import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAbsencesEditComponent } from './open-absences-edit.component';

describe('OpenAbsencesEditComponent', () => {
  let component: OpenAbsencesEditComponent;
  let fixture: ComponentFixture<OpenAbsencesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenAbsencesEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
