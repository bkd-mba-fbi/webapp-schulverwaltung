import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { UserSettingsRestService } from './user-settings-rest.service';
import { buildUserSettingsWithNotificationSetting } from 'src/spec-builders';
import { isEqual } from 'lodash';
import { UserSettings, AccessInfo } from '../models/user-settings.model';

describe('UserSettingsRestService', () => {
  let service: UserSettingsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(UserSettingsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('updates cst setting of the current user', () => {
    const settings = buildUserSettingsWithNotificationSetting(true, true, true);

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
        }),
    );

    expect().nothing();
  });

  it('request cst settings of the current user', () => {
    const settings = buildUserSettingsWithNotificationSetting(true, true, true);
    service.getUserSettingsCst().subscribe((result) => {
      expect(result).toBe(settings);
    });
    const url = 'https://eventotest.api/UserSettings/Cst';
    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(UserSettings.encode(settings));
  });

  it('request access info of the current user', () => {
    const accessInfo: AccessInfo = {
      AccessInfo: {
        Roles: ['TeacherRole', 'ClassTeacherRole'],
        Permissions: ['PersonRight'],
      },
    };
    service.getAccessInfo().subscribe((result) => {
      expect(result).toBe(accessInfo['AccessInfo']);
    });
    const url = 'https://eventotest.api/UserSettings/?expand=AccessInfo';
    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(AccessInfo.encode(accessInfo));
  });
});
