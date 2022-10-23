import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;
  let translateService: jasmine.SpyObj<TranslateService>;

  const spy = jasmine.createSpyObj('TranslateService', ['instant']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [ToastService, { provide: TranslateService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
