import { Injectable } from '@angular/core';

const LANGUAGE_KEY = 'uiCulture';
const ACCESS_TOKEN_KEY = 'CLX.LoginToken';
const REFRESH_TOKEN_KEY = 'CLX.RefreshToken';
const TOKEN_EXPIRE_KEY = 'CLX.TokenExpire';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getLanguage(): Option<string> {
    return this.getValue(LANGUAGE_KEY);
  }

  getAccessToken(): Option<string> {
    return this.getValue(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): Option<string> {
    return this.getValue(REFRESH_TOKEN_KEY);
  }

  getTokenExpire(): Option<string> {
    return this.getValue(TOKEN_EXPIRE_KEY);
  }

  private getValue(key: string): Option<string> {
    return localStorage.getItem(key);
  }
}
