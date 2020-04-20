import * as t from 'io-ts/lib/index';
import { HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { decodeArray } from './decode';

export interface Paginated<T> {
  offset: number;
  total: number;
  entries: T;
}

/**
 * Decodes a paginated response and includes the offset/total in the
 * result. To be used in conjuction with a `HttpClient` call with the
 * `observe: 'response'` option set.
 *
 * Example usage:
 *
 *   function fetch(
 *     offset: number,
 *     limit: number
 *   ): Observable<Paginated<ReadonlyArray<User>>>
 *     const params = new HttpParams().set('foo', 'bar');
 *     return this.http.get<unknown>('/api/users', {
 *       params: paginatedParams(offset, limit, params),
 *       headers: paginatedHeaders(),
 *       observe: 'response'
 *     })
 *     .pipe(decodePaginatedResponse(User));
 *   }
 */
export function decodePaginatedResponse<C extends t.Mixed>(
  codec: C
): (
  source: Observable<HttpResponse<unknown>>
) => Observable<Paginated<ReadonlyArray<t.TypeOf<C>>>> {
  return (source) => {
    return source.pipe(
      switchMap((response) => {
        const offset = Number(response.headers.get('X-Pagination-Offset'));
        const total = Number(response.headers.get('X-Pagination-Total'));
        return decodeArray(codec)(response.body).pipe(
          map((entries) => ({ offset, total, entries }))
        );
      })
    );
  };
}

export function paginatedParams(
  offset: number,
  limit: number,
  params = new HttpParams()
): HttpParams {
  return params.set('offset', String(offset)).set('limit', String(limit));
}

export function paginatedHeaders(headers = new HttpHeaders()): HttpHeaders {
  // Enable the `X-Pagination-Total` in the result
  return headers.set('X-Pagination-Total', 'on');
}
