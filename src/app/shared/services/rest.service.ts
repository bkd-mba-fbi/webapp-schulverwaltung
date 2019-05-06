import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { SettingsService } from './settings.service';

export abstract class RestService<T> {
  constructor(
    protected http: HttpClient,
    protected settings: SettingsService,
    protected resourcePath: string
  ) {}

  get(id: number): Observable<T> {
    return this.withBaseUrl(url => this.http.get<any>(`${url}/${id}`)).pipe(
      map((json: any) => this.buildEntry(json))
    );
  }

  getList(params?: any): Observable<ReadonlyArray<T>> {
    return this.withBaseUrl(url =>
      this.http
        .get<any[]>(url, this.buildRequestOptions(params))
        .pipe(map((json: any[]) => this.buildList(json)))
    );
  }

  protected withBaseUrl<R>(
    callback: (url: string) => Observable<R>
  ): Observable<R> {
    return this.settings.apiUrl$.pipe(
      switchMap(baseUrl => callback(this.buildBaseUrl(baseUrl)))
    );
  }

  protected buildRequestOptions(params?: Dict<any>): { params?: HttpParams } {
    if (!params) {
      return {};
    }
    return {
      params: Object.keys(params).reduce(
        (s, key) => s.append(key, params[key]),
        new HttpParams()
      )
    };
  }

  protected buildBaseUrl(baseUrl: string): string {
    return [baseUrl, this.resourcePath].join('/');
  }

  protected abstract buildEntry(json: any): T;

  protected buildList(json: any[]): ReadonlyArray<T> {
    return json.map(e => this.buildEntry(e));
  }
}
