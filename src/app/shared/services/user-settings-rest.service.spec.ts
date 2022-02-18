import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { UserSettingsRestService } from './user-settings-rest.service';
import { buildUserSettingWithNotificationSetting } from 'src/spec-builders';
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

  it('updates cst setting of the current user', () => {
    const settings = buildUserSettingWithNotificationSetting(true, true, true);

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

    expect().nothing();
  });

  it('request cst settings of the current user', () => {
    service.getUserSettingsCst().subscribe((result) => {});
    const url = 'https://eventotest.api/UserSettings/Cst';
    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush([]);
  });
});
