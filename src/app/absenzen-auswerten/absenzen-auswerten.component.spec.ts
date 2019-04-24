import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { AbsenzenAuswertenComponent } from './absenzen-auswerten.component';

describe('AbsenzenAuswertenComponent', () => {
  let component: AbsenzenAuswertenComponent;
  let fixture: ComponentFixture<AbsenzenAuswertenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [AbsenzenAuswertenComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenzenAuswertenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
