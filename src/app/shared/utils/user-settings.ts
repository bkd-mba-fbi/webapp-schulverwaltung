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

export function updateGroupViews(
  groupView: GroupViewType,
  groupsViews: ReadonlyArray<GroupViewType>
): ReadonlyArray<GroupViewType> {
  const updatedGroupViews = [...groupsViews].filter(
    (gv) => gv.eventId !== groupView.eventId
  );
  if (groupView.group) {
    updatedGroupViews.push(groupView);
  }
  return updatedGroupViews;
}
