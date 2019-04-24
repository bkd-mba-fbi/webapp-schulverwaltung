import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffeneAbsenzenComponent } from './offene-absenzen.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('OffeneAbsenzenComponent', () => {
  let component: OffeneAbsenzenComponent;
  let fixture: ComponentFixture<OffeneAbsenzenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OffeneAbsenzenComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffeneAbsenzenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
