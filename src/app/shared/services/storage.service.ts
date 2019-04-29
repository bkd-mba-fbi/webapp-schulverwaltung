import { Injectable } from '@angular/core';

const LANGUAGE_KEY = 'uiCulture';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getLanguage(): Option<string> {
    return this.getValue(LANGUAGE_KEY);
  }

  private getValue(key: string): Option<string> {
    return localStorage.getItem(key);
  }
}
