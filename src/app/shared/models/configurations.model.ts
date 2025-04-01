import * as t from "io-ts";

const SubscriptionDetailsDisplay = t.type({
  adAsColumns: t.array(t.number),
  adAsCriteria: t.array(t.number),
});

type SubscriptionDetailsDisplay = t.TypeOf<typeof SubscriptionDetailsDisplay>;
export { SubscriptionDetailsDisplay };
