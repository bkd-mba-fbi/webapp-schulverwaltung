import { Params } from '@angular/router';

export function parseQueryString(queryString: any): Params {
  return String(queryString || '')
    .split('&')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      return { ...acc, [key]: value };
    }, {});
}
