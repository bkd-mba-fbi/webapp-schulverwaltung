/**
 * The api provides dates without timezone;
 * to prevent problems, the date string is parsed manually.
 * See https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone/33909265#33909265
 */
export function parseISOLocalDateTime(dateString: string): Date {
  const dateArray = dateString.split(/\D/).map(d => Number(d));
  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5]
  );
}

/**
 * The api provides dates without time;
 * to prevent problems, the date string is parsed manually.
 * See https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone/33909265#33909265
 */
export function parseISOLocalDate(dateString: string): Date {
  const dateArray = dateString.split(/\D/).map(d => Number(d));
  return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
}

/**
 * The api provides dates without timezone;
 * to prevent problems, the date string is formatted manually.
 * See https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone/33909265#33909265
 */
export function formatISOLocalDateTime(date: Date): string {
  return (
    formatISOLocalDate(date) +
    `T${zeroPadding(date.getHours())}:${zeroPadding(
      date.getMinutes()
    )}:${zeroPadding(date.getSeconds())}`
  );
}

/**
 * The api provides dates without time;
 * to prevent problems, the date string is formatted manually.
 * See https://stackoverflow.com/questions/33908299/javascript-parse-a-string-to-date-as-local-time-zone/33909265#33909265
 */
export function formatISOLocalDate(date: Date): string {
  return `${date.getFullYear()}-${zeroPadding(
    date.getMonth() + 1
  )}-${zeroPadding(date.getDate())}`;
}

function zeroPadding(value: number): string {
  return ('0' + value).slice(-2);
}
