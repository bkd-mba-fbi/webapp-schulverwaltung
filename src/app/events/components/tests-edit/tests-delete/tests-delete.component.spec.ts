import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsDeleteComponent } from './tests-delete.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { buildTestModuleMetadata } from '../../../../../spec-helpers';
import { buildTest } from 'src/spec-builders';

describe('TestsDeleteComponent', () => {
  let component: TestsDeleteComponent;
  let fixture: ComponentFixture<TestsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsDeleteComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
