import * as t from "io-ts";

const SubscriptionDetailsDisplay = t.type({
  adAsColumns: t.readonlyArray(t.number),
  adAsCriteria: t.readonlyArray(t.number),
});

type SubscriptionDetailsDisplay = t.TypeOf<typeof SubscriptionDetailsDisplay>;
export { SubscriptionDetailsDisplay };
