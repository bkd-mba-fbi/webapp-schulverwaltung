import * as t from "io-ts";

const SubscriptionDetailsDisplay = t.type({
  adAsColumns: t.readonlyArray(t.number),
  adAsCriteria: t.readonlyArray(t.number),
  testGradingScaleIds: t.readonlyArray(t.number),
});

const SchoolAppNavigation = t.type({
  practicalTrainerActionEMail: t.boolean,
});

type SubscriptionDetailsDisplay = t.TypeOf<typeof SubscriptionDetailsDisplay>;
type SchoolAppNavigation = t.TypeOf<typeof SchoolAppNavigation>;

export { SubscriptionDetailsDisplay, SchoolAppNavigation };
