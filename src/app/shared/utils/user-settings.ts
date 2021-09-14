import { buildUserSetting } from '../../../spec-builders';
import {
  BaseProperty,
  GroupViewType,
  UserSetting,
} from '../models/user-setting.model';

export function getUserSetting(key: string, propertyBody: any): UserSetting {
  const body: BaseProperty = {
    Key: key,
    Value: JSON.stringify(propertyBody),
  };
  const cst = Object.assign({}, buildUserSetting());
  cst.Settings.push(body);
  return cst;
}

export function updateGroupViewSettings(
  group: Option<string>,
  eventIds: ReadonlyArray<number>,
  existingSettings: ReadonlyArray<GroupViewType>
): ReadonlyArray<GroupViewType> {
  const newSettings: ReadonlyArray<GroupViewType> = eventIds.map((eventId) => {
    return { eventId, group };
  });

  const updatedSettings = existingSettings.map(
    (es) => newSettings.find((ns) => ns.eventId === es.eventId) || es
  );

  return [...new Set([...updatedSettings, ...newSettings])].filter(
    (settings) => settings.group !== null
  );
}
