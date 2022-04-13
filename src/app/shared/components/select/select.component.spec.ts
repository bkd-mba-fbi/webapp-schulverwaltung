import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({})
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    element = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit value', () => {
    spyOn(component.valueChange, 'emit');
    component.value = 1;
    component.itemChanged();
    expect(component.valueChange.emit).toHaveBeenCalledWith(1);
  });
});
