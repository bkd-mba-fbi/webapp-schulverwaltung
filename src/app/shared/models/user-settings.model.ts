import * as t from "io-ts";
import { withFallback } from "io-ts-types";
import { JsonFromUnknown, Option } from "./common-types";
import { DropDownItem } from "./drop-down-item.model";

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
  }),
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
  "NotificationTypesInactive",

  // is (type guard):
  (input: unknown): input is ReadonlyArray<string> =>
    Array.isArray(input) && input.every((v) => typeof v === "string"),

  // validate & decode:
  (input, context) =>
    typeof input === "string"
      ? t.success(input.split(";").filter(Boolean))
      : t.failure(input, context),

  // encode:
  (output) => output.join(";"),
);

export enum PresenceControlViewMode {
  Grid = "grid",
  List = "list",
}

const PresenceControlViewModeObject = JsonFromUnknown.pipe(
  t.type({
    presenceControl: t.keyof({
      // Use keyof instead of literal union because reasons: https://github.com/gcanti/io-ts/blob/master/index.md#union-of-string-literals
      grid: null,
      list: null,
    }),
  }),
);

const PresenceControlGroupViewEntry = t.type({
  eventId: Option(t.number),
  group: Option(DropDownItem.props.Key),
});

const PresenceControlGroupView = JsonFromUnknown.pipe(
  t.readonly(t.array(PresenceControlGroupViewEntry)),
);

//
// END Special Types used for Module Services
//

const AccessInfo = t.type({
  AccessInfo: t.type({
    Roles: t.array(t.string),
    Permissions: t.array(t.string),
  }),
});

type UserSetting = t.TypeOf<typeof UserSetting>;
type UserSettings = t.TypeOf<typeof UserSettings>;
type NotificationChannels = t.TypeOf<typeof NotificationChannels>;
type NotificationTypesInactive = t.TypeOf<typeof NotificationTypesInactive>;
type PresenceControlViewModeObject = t.TypeOf<
  typeof PresenceControlViewModeObject
>;
type PresenceControlGroupViewEntry = t.TypeOf<
  typeof PresenceControlGroupViewEntry
>;
type PresenceControlGroupView = t.TypeOf<typeof PresenceControlGroupView>;
type AccessInfo = t.TypeOf<typeof AccessInfo>;

export {
  UserSettings,
  UserSetting,
  NotificationChannels,
  NotificationTypesInactive,
  PresenceControlViewModeObject,
  PresenceControlGroupViewEntry,
  PresenceControlGroupView,
  AccessInfo,
};
