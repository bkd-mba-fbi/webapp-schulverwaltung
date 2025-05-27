import * as t from "io-ts";
import { Option } from "./common-types";

const GradingItem = t.type({
  Id: t.string,
  IdPerson: t.number,
  // IdSubscription: 10413,
  // IdEvent: 10064,
  PersonFullname: t.string,
  // PersonNameTooltip: "Beispiel Johanna",
  // MatriculationNumber: null,
  IdGrade: Option(t.number),
  GradeValue: Option(t.string),
  Comment: Option(t.string),
  // SubscriptionDetails: null,
  // ColumnDetails: null,
  // IdObject: "10413",
  // AnlassEditAllowed: true,
  // HRef: "/restApi/GradingItems/10413",
});

type GradingItem = t.TypeOf<typeof GradingItem>;
export { GradingItem };
