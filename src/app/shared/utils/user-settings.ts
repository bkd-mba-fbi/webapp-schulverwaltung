import { buildUserSetting } from '../../../spec-builders';
import { BaseProperty, UserSetting } from '../models/user-setting.model';

export function getUserSetting(key: string, propertyBody: any): UserSetting {
  const body: BaseProperty = {
    Key: key,
    Value: JSON.stringify(propertyBody),
  };
  const cst = Object.assign({}, buildUserSetting());
  cst.Settings.push(body);
  return cst;
}
