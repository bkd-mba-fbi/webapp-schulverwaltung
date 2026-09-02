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

/**
 * Narrows a drop down item's key to a number, since keys are typed
 * wider than the values they usually represent.
 */
export function keyToNumber(value: DropDownItem["Key"]): number;
export function keyToNumber(value: Option<DropDownItem["Key"]>): Option<number>;
export function keyToNumber(
  value: Option<DropDownItem["Key"]>,
): Option<number> {
  return value === null ? null : Number(value);
}

/**
 * Narrows drop down items' keys to numbers, since keys are typed wider
 * than the values they usually represent.
 */
export function keysToNumbers(
  values: ReadonlyArray<DropDownItem["Key"]>,
): ReadonlyArray<number>;
export function keysToNumbers(
  values: Option<ReadonlyArray<DropDownItem["Key"]>>,
): Option<ReadonlyArray<number>>;
export function keysToNumbers(
  values: Option<ReadonlyArray<DropDownItem["Key"]>>,
): Option<ReadonlyArray<number>> {
  return values === null ? null : values.map((value) => keyToNumber(value));
}

/**
 * Narrows a drop down item's key to a string, since keys are typed
 * wider than the values they usually represent.
 */
export function keyToString(value: DropDownItem["Key"]): string;
export function keyToString(value: Option<DropDownItem["Key"]>): Option<string>;
export function keyToString(
  value: Option<DropDownItem["Key"]>,
): Option<string> {
  return value === null ? null : String(value);
}

/**
 * Narrows drop down items' keys to strings, since keys are typed wider
 * than the values they usually represent.
 */
export function keysToStrings(
  values: ReadonlyArray<DropDownItem["Key"]>,
): ReadonlyArray<string>;
export function keysToStrings(
  values: Option<ReadonlyArray<DropDownItem["Key"]>>,
): Option<ReadonlyArray<string>>;
export function keysToStrings(
  values: Option<ReadonlyArray<DropDownItem["Key"]>>,
): Option<ReadonlyArray<string>> {
  return values === null ? null : values.map((value) => keyToString(value));
}
