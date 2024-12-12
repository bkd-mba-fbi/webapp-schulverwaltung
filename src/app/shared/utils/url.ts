import {
  DefaultUrlSerializer,
  PRIMARY_OUTLET,
  Params,
  RouterLink,
  UrlSegment,
  UrlSegmentGroup,
} from "@angular/router";

/**
 * Parses given query string to params object
 */
export function parseQueryString(queryString: unknown): Params {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(queryString || "")
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc, pair) => {
      const [key, value] = pair.split("=");
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
    .join("&");
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

export type Link = {
  link: RouterLink["routerLink"];
  params: Params;
};

/**
 * Convert a string URL to a link that can be used with [routerLink] and [queryParams] directives.
 */
export function convertLink(url: string): Link {
  const { pathname, search } = new URL(url, window.location.href);
  return {
    link: pathname,
    params: parseQueryString(search),
  };
}
