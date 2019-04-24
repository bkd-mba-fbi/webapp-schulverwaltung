import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PraesenzkontrolleComponent } from './praesenzkontrolle.component';

describe('PraesenzkontrolleComponent', () => {
  let component: PraesenzkontrolleComponent;
  let fixture: ComponentFixture<PraesenzkontrolleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PraesenzkontrolleComponent]
      })
    ).compileComponents();
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
