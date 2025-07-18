import { Injectable } from "@angular/core";
import { TokenPayload } from "src/app/shared/models/token-payload.model";

const LANGUAGE_KEY = "uiCulture";
const ACCESS_TOKEN_KEY = "CLX.LoginToken";
const REFRESH_TOKEN_KEY = "CLX.RefreshToken";
const TOKEN_EXPIRE_KEY = "CLX.TokenExpire";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  getLanguage(): Option<string> {
    return this.getValue(LANGUAGE_KEY);
  }

  getAccessToken(): Option<string> {
    const token = this.getValue(ACCESS_TOKEN_KEY);
    return token ? token.replace(/^"+|"+$/g, "") : null;
  }

  getRefreshToken(): Option<string> {
    return this.getValue(REFRESH_TOKEN_KEY);
  }

  getTokenExpire(): Option<string> {
    return this.getValue(TOKEN_EXPIRE_KEY);
  }

  getPayload(): Option<TokenPayload> {
    const token = this.getAccessToken();
    const base64Url = token ? token.split(".")[1] : null;
    const base64 = base64Url
      ? base64Url.replace("-", "+").replace("_", "/")
      : null;
    const base64Bytes = this.base64ToBytes(base64 ? base64 : "");
    const payload = JSON.parse(new TextDecoder().decode(base64Bytes));
    payload.roles =
      "holder_roles" in payload ? payload.holder_roles : payload.roles;
    return payload;
  }

  private getValue(key: string): Option<string> {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  private base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
    const binaryString = window.atob(base64);
    return Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  }
}
