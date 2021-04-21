import {
  DefaultUrlSerializer,
  Params,
  PRIMARY_OUTLET,
  UrlSegment,
  UrlSegmentGroup,
} from '@angular/router';

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

/**
 * Returns the first segment of the given url
 */
export function getFirstSegment(url: string): string | null {
  const serializer = new DefaultUrlSerializer();
  const tree = serializer.parse(url);
  const g: UrlSegmentGroup = tree?.root.children[PRIMARY_OUTLET];
  const s: UrlSegment[] = g?.segments;
  return s ? s[0].path : null;
}
