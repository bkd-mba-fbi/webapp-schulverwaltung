import { either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { withFallback, withValidate } from 'io-ts-types';

/*
 There are separated base and special Types defined.
 These are not combined directly within this model because 
 there are several drawbacks when using io-ts (specially 
 branded types, JsonFromString which are used for nested
 JSON) and their TS compatibility. Thus the binding of
 the base and special types is done within the data service
 `my-settins.service`.
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
  HRef: t.any,
});

//
// END Base Types used for REST Service
//

//
// START Special Types used for Service
//

// Workaround, because io-ts branded is not accepted by TS
const NotificationPropertyKey = withValidate(t.string, (u, c) =>
  either.chain(t.string.validate(u, c), (s) => {
    return s === 'notification' ? t.success(s) : t.failure(u, c);
  })
);

const NotificationPropertyValueType = t.type({
  mail: withFallback(t.boolean, false),
  gui: withFallback(t.boolean, false),
  phoneMobile: withFallback(t.boolean, false),
});

const NotificationProperty = t.intersection([
  BaseProperty,
  t.type({
    Key: NotificationPropertyKey,
    Value: t.string,
  }),
]);

//
// END Special Types used for Service
//

type BaseProperty = t.TypeOf<typeof BaseProperty>;
type UserSetting = t.TypeOf<typeof UserSetting>;
type NotificationProperty = t.TypeOf<typeof NotificationProperty>;
type NotificationPropertyValueType = t.TypeOf<
  typeof NotificationPropertyValueType
>;

export {
  UserSetting,
  BaseProperty,
  NotificationProperty,
  NotificationPropertyValueType,
};
