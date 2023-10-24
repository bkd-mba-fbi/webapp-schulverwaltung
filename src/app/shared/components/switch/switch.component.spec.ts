import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [SwitchComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it('renders a checkbox with auto generated id', async () => {
    await waitForRender();
    const checkbox = getInput();
    expect(checkbox.getAttribute('id')).toBeDefined();
  });

  it('renders a checkbox with custom id', async () => {
    component.id = 'custom-id';
    await waitForRender();
    const checkbox = getInput();
    expect(checkbox.id).toBe('custom-id');
  });

  it('renders disabled checkbox', async () => {
    component.disabled = true;
    await waitForRender();
    const checkbox = getInput();
    expect(checkbox.disabled).toBe(true);
  });

  it('renders checkbox with given value', async () => {
    await waitForRender();
    const checkbox = getInput();

    component.value = true;
    await waitForRender();
    expect(checkbox.checked).toBe(true);

    component.value = false;
    await waitForRender();
    expect(checkbox.checked).toBe(false);
  });

  it('emits value change on checkbox click', async () => {
    const callback = jasmine.createSpy('callback');
    component.value = false;
    component.valueChange.subscribe(callback);
    await waitForRender();

    const checkbox = getInput();
    checkbox.click();
    expect(callback).toHaveBeenCalledWith(true);
  });

  function getInput(): HTMLInputElement {
    const input = element.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    expect(input).toBeDefined();
    return input!;
  }

  function waitForRender() {
    fixture.detectChanges();
    return fixture.whenStable();
  }
});
