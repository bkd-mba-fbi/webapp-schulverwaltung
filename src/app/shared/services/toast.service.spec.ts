import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { ToastInfo, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let callback: jasmine.Spy;

  beforeEach(() => {
    callback = jasmine.createSpy('callback');

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ToastService],
      }),
    );
    service = TestBed.inject(ToastService);
    service.toasts$.subscribe(callback);

    expect(callback).toHaveBeenCalledWith([]);
    callback.calls.reset();
  });

  it('adds a success toast', () => {
    const toast: ToastInfo = {
      message: 'This is good',
      header: 'Good title',
      classname: 'bg-success text-light',
      icon: 'check_circle',
    };
    service.success(toast.message, toast.header);
    expect(callback).toHaveBeenCalledWith([toast]);
  });

  it('adds a warning toast', () => {
    const toast: ToastInfo = {
      message: 'This is not so good',
      header: 'Not so good title',
      classname: 'bg-warning',
      icon: 'help',
    };
    service.warning(toast.message, toast.header);
    expect(callback).toHaveBeenCalledWith([toast]);
  });

  it('adds an error toast', () => {
    const toast: ToastInfo = {
      message: 'This is bad',
      header: 'Bad title',
      classname: 'bg-danger text-light',
      icon: 'cancel',
    };
    service.error(toast.message, toast.header);
    expect(callback).toHaveBeenCalledWith([toast]);
  });

  it('adds multiple toasts but ignores duplicates', () => {
    const toast1: ToastInfo = {
      message: 'Toast 1',
      header: undefined,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    };
    const toast2: ToastInfo = {
      message: 'Toast 2',
      header: undefined,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    };

    service.success(toast1.message);
    expect(callback).toHaveBeenCalledWith([toast1]);

    callback.calls.reset();
    service.success(toast2.message);
    expect(callback).toHaveBeenCalledWith([toast1, toast2]);

    callback.calls.reset();
    service.success(toast1.message);
    expect(callback).not.toHaveBeenCalled();
  });

  it('adds & removes toast', () => {
    const toast1: ToastInfo = {
      message: 'Toast A',
      header: undefined,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    };
    const toast2: ToastInfo = {
      message: 'Toast B',
      header: undefined,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    };

    service.success(toast1.message);
    service.success(toast2.message);
    expect(callback).toHaveBeenCalledWith([toast1, toast2]);

    callback.calls.reset();
    service.remove(toast1);
    expect(callback).toHaveBeenCalledWith([toast2]);
  });
});
