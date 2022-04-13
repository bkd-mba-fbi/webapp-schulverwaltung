import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { MultiselectComponent } from './multiselect.component';

describe('MultiselectComponent', () => {
  let component: MultiselectComponent;
  let fixture: ComponentFixture<MultiselectComponent>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({})
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectComponent);
    element = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit values', () => {
    spyOn(component.valuesChange, 'emit');
    component.values = [1, 2];
    component.itemsChanged();
    expect(component.valuesChange.emit).toHaveBeenCalledWith([1, 2]);
  });
});
