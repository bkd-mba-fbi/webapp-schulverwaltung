import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { SimpleChange } from '@angular/core';
import { StorageService } from '../../services/storage.service';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken(): string {
                return 'asdf';
              }
            }
          }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('.avatarStyles$', () => {
    it('emits styles object with avatar image and fallback', () => {
      component.studentId = 123;

      component.ngOnChanges({
        studentId: new SimpleChange(null, component.studentId, true)
      });
      fixture.detectChanges();

      expect(component.avatarStyles).toEqual({
        'background-image':
          'url(https://eventotest.api/Files/personPictures/123?token=asdf), url(assets/images/avatar-placeholder.png)'
      });
    });
  });
});
