import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierGradesComponent } from './dossier-grades.component';

describe('StudentGradesComponent', () => {
  let component: DossierGradesComponent;
  let fixture: ComponentFixture<DossierGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DossierGradesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
