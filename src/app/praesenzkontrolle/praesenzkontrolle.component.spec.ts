import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraesenzkontrolleComponent } from './praesenzkontrolle.component';

describe('PraesenzkontrolleComponent', () => {
  let component: PraesenzkontrolleComponent;
  let fixture: ComponentFixture<PraesenzkontrolleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PraesenzkontrolleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraesenzkontrolleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
