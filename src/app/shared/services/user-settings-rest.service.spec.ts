import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { UserSettingsRestService } from './user-settings-rest.service';
import { buildUserSettingWithNotification } from 'src/spec-builders';
import { isEqual } from 'lodash';

describe('UserSettingsRestService', () => {
  let service: UserSettingsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(UserSettingsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.updateUserSettingsCst', () => {
    it('updates settings of the current user', () => {
      const settings = buildUserSettingWithNotification(true, true, true);

      service.updateUserSettingsCst(settings);

      httpTestingController.match(
        (req) =>
          req.method === 'PATCH' &&
          req.urlWithParams === 'https://eventotest.api/UserSettings/Cst' &&
          isEqual(req.body, {
            Id: 'Cst',
            Values: [
              {
                Key: 'notification',
                Value: JSON.stringify({
                  gui: true,
                  mail: true,
                  phoneMobile: true,
                }),
              },
            ],
            HRef: null,
          })
      );
    });
  });

  /* is empty by default, so nothing to test here
  describe('.getUserSettingsCst', () => {
    it('requests all settings of the current user', () => {
      const settings = [buildUserSetting('Cst')];

      service.getUserSettingsCst().subscribe((result) => {
        ...
      });

      const url = 'https://eventotest.api/UserSettings/Cst';
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(t.array(UserSetting).encode(settings));
    });
  });
  */
});
