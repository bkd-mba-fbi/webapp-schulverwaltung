import { Params } from '@angular/router';

/**
 * Parses given query string to params object
 */
export function parseQueryString(queryString: any): Params {
  return String(queryString || '')
    .split('&')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      return { ...acc, [key]: value };
    }, {});
}

/**
 * Renders given params object as query string
 */
export function serializeParams(params: Params): string {
  return Object.keys(params)
    .reduce((acc, key) => {
      const value = params[key];
      return [...acc, value == null ? key : `${key}=${value}`];
    }, [] as ReadonlyArray<string>)
    .join('&');
}
