import * as t from 'io-ts';
import { withFallback } from 'io-ts-types';
import { Option } from './common-types';

/*
 There are separated base and special Types defined.
 Some are not combined directly within this model because 
 there are several drawbacks when using io-ts (specially 
 branded types, JsonFromString which are used for *nested
 JSON*) and their TS compatibility. Thus the binding of 
 Value-Type (nested JSON) is solved within the module services
 */

//
// START Base Types used for REST Service
//

const BaseProperty = t.interface({
  Key: t.string,
  Value: t.string,
});

const UserSetting = t.type({
  Id: t.string,
  Settings: t.array(BaseProperty),
});

//
// END Base Types used for REST Service
//

//
// START Special Types used for Module Services
//

const NotificationSettingPropertyValueType = t.type({
  mail: withFallback(t.boolean, false),
  gui: withFallback(t.boolean, false),
  phoneMobile: withFallback(t.boolean, false),
});

const NotificationDataPropertyValueType = t.type({
  id: t.number,
  subject: t.string,
  body: t.string,
});

const ViewModeType = t.type({
  presenceControl: t.string,
});

const GroupViewType = t.type({
  lessonId: Option(t.string),
  group: Option(t.string),
});

//
// END Special Types used for Module Services
//

type BaseProperty = t.TypeOf<typeof BaseProperty>;
type UserSetting = t.TypeOf<typeof UserSetting>;
type NotificationSettingPropertyValueType = t.TypeOf<
  typeof NotificationSettingPropertyValueType
>;
type NotificationDataPropertyValueType = t.TypeOf<
  typeof NotificationDataPropertyValueType
>;
type ViewModeType = t.TypeOf<typeof ViewModeType>;
type GroupViewType = t.TypeOf<typeof GroupViewType>;

export {
  UserSetting,
  BaseProperty,
  NotificationSettingPropertyValueType,
  NotificationDataPropertyValueType,
  ViewModeType,
  GroupViewType,
};
