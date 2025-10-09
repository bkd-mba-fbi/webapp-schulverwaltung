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
    if (!token) return null;

    const payload = this.parseTokenPayload(token);
    payload.roles =
      "holder_roles" in payload && typeof payload.holder_roles === "string"
        ? payload.holder_roles
        : payload.roles;
    return payload;
  }

  private getValue(key: string): Option<string> {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  private parseTokenPayload(token: string): TokenPayload {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = atob(base64);
    const decoder = new TextDecoder("utf-8");
    const decodedString = decoder.decode(
      Uint8Array.from(decodedData, (c) => c.charCodeAt(0)),
    );
    return JSON.parse(decodedString);
  }
}
