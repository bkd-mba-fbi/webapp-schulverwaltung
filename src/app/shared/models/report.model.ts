import * as t from "io-ts";
import { Option } from "./common-types";

const AvailableReport = t.type({
  Id: t.number,
  Title: t.string,
  // AllowedKeys: null,
  // IdObject: t.number,
  // HRef: t.string
});

const AvailableReports = Option(t.array(AvailableReport));

type AvailableReports = t.TypeOf<typeof AvailableReports>;
export { AvailableReports };
