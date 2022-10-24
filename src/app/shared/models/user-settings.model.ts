import * as t from 'io-ts';
import { Json, withFallback } from 'io-ts-types';
import { JsonFromUnknown, Option } from './common-types';

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

const UserSetting = t.type({
  Key: t.string,
  Value: t.string,
});

const UserSettings = t.type({
  Id: t.string,
  Settings: t.readonly(t.array(UserSetting)),
});

//
// END Base Types used for REST Service
//

//
// START Concrete Types for UserSetting values
//

const NotificationChannels = JsonFromUnknown.pipe(
  t.type({
    mail: withFallback(t.boolean, false),
    gui: withFallback(t.boolean, false),
    phoneMobile: withFallback(t.boolean, false),
  })
);

/**
 * Type for values of the `notificationTypesInactive` setting, will
 * decode semicolon-separated strings
 * (`"BM2Teacher;absenceMessage;teacherSubstitutions"`) to an array
 * (`["BM2Teacher", "absenceMessage", "teacherSubstitutions"]`) and
 * vice versa.
 */
const NotificationTypesInactive = new t.Type<
  ReadonlyArray<string>,
  string,
  unknown
>(
  'NotificationTypesInactive',

  // is (type guard):
  (input: unknown): input is ReadonlyArray<string> =>
    Array.isArray(input) && input.every((v) => typeof v === 'string'),

  // validate & decode:
  (input, context) =>
    typeof input === 'string'
      ? t.success(input.split(';').filter(Boolean))
      : t.failure(input, context),

  // encode:
  (output) => output.join(';')
);

const NotificationDataEntry = t.type({
  id: t.number,
  subject: t.string,
  body: t.string,
});

const NotificationData = JsonFromUnknown.pipe(
  t.readonly(t.array(NotificationDataEntry))
);

export enum PresenceControlViewMode {
  Grid = 'grid',
  List = 'list',
}

const PresenceControlViewModeObject = JsonFromUnknown.pipe(
  t.type({
    presenceControl: t.keyof({
      // Use keyof instead of literal union because reasons: https://github.com/gcanti/io-ts/blob/master/index.md#union-of-string-literals
      grid: null,
      list: null,
    }),
  })
);

const PresenceControlGroupViewEntry = t.type({
  eventId: Option(t.number),
  group: Option(t.string),
});

const PresenceControlGroupView = JsonFromUnknown.pipe(
  t.readonly(t.array(PresenceControlGroupViewEntry))
);

//
// END Special Types used for Module Services
//

type UserSetting = t.TypeOf<typeof UserSetting>;
type UserSettings = t.TypeOf<typeof UserSettings>;
type NotificationChannels = t.TypeOf<typeof NotificationChannels>;
type NotificationData = t.TypeOf<typeof NotificationData>;
type NotificationDataEntry = t.TypeOf<typeof NotificationDataEntry>;
type NotificationTypesInactive = t.TypeOf<typeof NotificationTypesInactive>;
type PresenceControlViewModeObject = t.TypeOf<
  typeof PresenceControlViewModeObject
>;
type PresenceControlGroupViewEntry = t.TypeOf<
  typeof PresenceControlGroupViewEntry
>;
type PresenceControlGroupView = t.TypeOf<typeof PresenceControlGroupView>;

export {
  UserSettings,
  UserSetting,
  NotificationChannels,
  NotificationData,
  NotificationDataEntry,
  NotificationTypesInactive,
  PresenceControlViewModeObject,
  PresenceControlGroupViewEntry,
  PresenceControlGroupView,
};
