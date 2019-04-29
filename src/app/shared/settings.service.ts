import { Injectable } from '@angular/core';
import { defer, of, Observable } from 'rxjs';
import { map, retryWhen, delay, pluck, shareReplay } from 'rxjs/operators';

export interface Settings {
  apiUrl: string;
}

const SETTINGS_RETRY_COUNT = 10;
const SETTINGS_RETRY_DELAY = 500;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings$ = this.loadSettings();
  apiUrl$ = this.settings$.pipe(pluck<Settings, string>('apiUrl'));

  private loadSettings(): Observable<Settings> {
    return defer(() => of(this.settings)).pipe(
      map(settings => {
        if (settings == null) {
          throw new Error('Settings not available');
        }
        return settings;
      }),
      retryWhen(this.retryNotifier$),
      shareReplay(1)
    );
  }

  private retryNotifier$(errors$: Observable<any>): Observable<any> {
    let retries = 0;
    return errors$.pipe(
      delay(SETTINGS_RETRY_DELAY),
      map(error => {
        if (retries++ === SETTINGS_RETRY_COUNT) {
          throw error;
        }
        return error;
      })
    );
  }

  private get settings(): Option<Settings> {
    return (
      ((window as any).absenzenmanagement &&
        (window as any).absenzenmanagement.settings) ||
      null
    );
  }
}
