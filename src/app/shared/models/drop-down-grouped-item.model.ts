import * as t from "io-ts";
import { DropDownItem } from "./drop-down-item.model";

const DropDownGroupedItem = t.type({
  Key: DropDownItem.props.Key,
  Value: DropDownItem.props.Value,
  Group: t.string,
});

type DropDownGroupedItem = t.TypeOf<typeof DropDownGroupedItem>;
export { DropDownGroupedItem };
