import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DropDownItem } from "../models/drop-down-item.model";

export function findDropDownItem$(
  items$: Observable<ReadonlyArray<DropDownItem>>,
  key: number,
): Observable<Option<DropDownItem>> {
  return items$.pipe(map((items) => items.find((i) => i.Key === key) || null));
}

export function sortDropDownItemsByValue(
  items: ReadonlyArray<DropDownItem>,
): ReadonlyArray<DropDownItem> {
  return items.slice().sort((a, b) => a.Value.localeCompare(b.Value));
}
