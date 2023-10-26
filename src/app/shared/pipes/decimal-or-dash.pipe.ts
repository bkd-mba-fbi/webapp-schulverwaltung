import { formatNumber } from "@angular/common";
import { Inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

const FRACTION_DIGITS_DEFAULT = "1-3";
export const DASH = "–";

@Pipe({
  name: "decimalOrDash",
})
export class DecimalOrDashPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(
    value: number | string | null | undefined,

    /**
     * Either a fixed fragtion digit amount as number or string
     * (e.g. 3) or a range (min/max, e.g. "0-3" or "1-2"). The integer
     * digits are hardcoded to a minimum of 1. If omitted the setting
     * is "1-3".
     *
     * See also https://angular.io/api/common/DecimalPipe#digitsinfo
     */
    fractionDigits?: number | string,

    locale?: string,
  ): string {
    const number = Number(value ?? null);
    if (isNaN(number)) return DASH;

    return formatDecimalOrDash(
      Number(value ?? null),
      locale ?? this.locale,
      fractionDigits,
    );
  }
}

export function formatDecimalOrDash(
  value: number,
  locale: string,

  /**
   * Either a fixed fragtion digit amount as number or string (e.g. 3)
   * or a range (min/max, e.g. "0-3" or "1-2"). The integer digits are
   * hardcoded to a minimum of 1. If omitted the setting is "1-3".
   *
   * See also https://angular.io/api/common/DecimalPipe#digitsinfo
   */
  fractionDigits?: number | string,
): string {
  return value === 0
    ? DASH
    : formatNumber(
        value,
        locale,
        `1.${normalizeFractionDigits(fractionDigits)}`,
      );
}

function normalizeFractionDigits(fractionDigits?: number | string): string {
  if (!fractionDigits) {
    return FRACTION_DIGITS_DEFAULT;
  }

  if (!String(fractionDigits).includes("-")) {
    return `${fractionDigits}-${fractionDigits}`;
  }

  return String(fractionDigits);
}
