const getTokenButton = document.getElementById("get-token-button");
const showTokenButton = document.getElementById("show-token-button");
const tokenDialog = document.getElementById("dev-auth-token-dialog");
const tokenValue = document.getElementById("dev-auth-token-value");
const revokeTokenStatus = document.getElementById("revoke-token-status");
const deleteTokenButton = document.getElementById("delete-token-button");
const revokeTokenButton = document.getElementById("revoke-token-button");
const closeTokenDialogButton = document.getElementById(
  "close-token-dialog-button",
);
const authControls = document.getElementById("dev-auth-controls");
const scopeSelect = document.getElementById("dev-auth-scope");
const oauthConfigUrl = "http://localhost:4200/dev.auth.json";
const verifierKey = "dev.auth.codeVerifier";
const stateKey = "dev.auth.state";
const returnHashKey = "dev.auth.returnHash";

function toBase64Url(bytes) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    "",
  );
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createRandomValue() {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

async function createCodeChallenge(verifier) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return toBase64Url(new Uint8Array(digest));
}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function getCurrentAccessToken() {
  const storedToken =
    sessionStorage.getItem("CLX.LoginToken") ??
    localStorage.getItem("CLX.LoginToken");
  if (!storedToken) return null;

  try {
    const parsedToken = JSON.parse(storedToken);
    return typeof parsedToken === "string" ? parsedToken : storedToken;
  } catch {
    return storedToken;
  }
}

function parseJwtPayload(accessToken) {
  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    throw new Error("The access token is not in a valid JWT format.");
  }

  const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const paddedPayload =
    base64Payload + "=".repeat((4 - (base64Payload.length % 4)) % 4);
  const binaryPayload = atob(paddedPayload);
  const payloadBytes = Uint8Array.from(binaryPayload, (character) =>
    character.charCodeAt(0),
  );
  const payloadText = new TextDecoder("utf-8", { fatal: true }).decode(
    payloadBytes,
  );
  const payload = JSON.parse(payloadText);
  if (!isObject(payload)) {
    throw new Error("The JWT payload is not an object.");
  }
  return payload;
}

function decodeJwtPayload(accessToken) {
  return JSON.stringify(parseJwtPayload(accessToken), null, 2);
}

function getTokenScope(accessToken) {
  try {
    const payload = parseJwtPayload(accessToken);
    const scope = payload.scope ?? payload.application_scope;
    if (typeof scope !== "string") return null;
    return (
      scope
        .split(/\s+/)
        .find((value) =>
          Array.from(scopeSelect.options).some(
            (option) => option.value === value,
          ),
        ) ?? null
    );
  } catch {
    return null;
  }
}

async function initializeDevAuth() {
  if (
    window.location.hostname !== "localhost" ||
    !getTokenButton ||
    !authControls ||
    !(scopeSelect instanceof HTMLSelectElement) ||
    !(showTokenButton instanceof HTMLButtonElement) ||
    !(tokenDialog instanceof HTMLDialogElement) ||
    !tokenValue ||
    !revokeTokenStatus ||
    !(deleteTokenButton instanceof HTMLButtonElement) ||
    !(revokeTokenButton instanceof HTMLButtonElement) ||
    !(closeTokenDialogButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const configResponse = await fetch(oauthConfigUrl, { cache: "no-store" });
  if (!configResponse.ok) {
    window.alert(
      `Could not load OAuth configuration from ${oauthConfigUrl} (${configResponse.status}). Add a dev.auth.json file to the root of the web server to enable local OAuth login.`,
    );
    return;
  }

  const config = await configResponse.json();
  const clientId = isObject(config)
    ? (config.clientId ?? config.ClientId)
    : undefined;
  if (
    !isObject(config) ||
    typeof config.OAuthServer !== "string" ||
    typeof config.Instance !== "string" ||
    typeof clientId !== "string"
  ) {
    window.alert(
      `Invalid OAuth configuration from ${oauthConfigUrl}. Add properties "OAuthServer", "Instance" and "ClientId" to the dev.auth.json file to enable local OAuth login.`,
    );
    return;
  }

  scopeSelect.selectedIndex = 0;
  const accessToken = getCurrentAccessToken();
  const tokenScope = accessToken ? getTokenScope(accessToken) : null;
  if (tokenScope) scopeSelect.value = tokenScope;

  const oauthServer = new URL(config.OAuthServer);
  if (!oauthServer.pathname.endsWith("/")) {
    oauthServer.pathname += "/";
  }

  const callbackUrl = new URL(window.location.href);
  const authorizationCode = callbackUrl.searchParams.get("code");

  if (authorizationCode) {
    const codeVerifier = sessionStorage.getItem(verifierKey);
    const expectedState = sessionStorage.getItem(stateKey);
    const returnedState = callbackUrl.searchParams.get("state");

    if (!codeVerifier || !expectedState || returnedState !== expectedState) {
      throw new Error("OAuth state verification failed.");
    }

    const tokenResponse = await fetch(
      new URL("Authorization/Token", oauthServer),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code: authorizationCode,
          code_verifier: codeVerifier,
        }),
      },
    );
    if (!tokenResponse.ok) {
      throw new Error(`OAuth token request failed (${tokenResponse.status}).`);
    }

    const tokenResult = await tokenResponse.json();
    if (
      !isObject(tokenResult) ||
      typeof tokenResult.access_token !== "string"
    ) {
      throw new Error("OAuth token response does not contain an access_token.");
    }

    sessionStorage.setItem(
      "CLX.LoginToken",
      JSON.stringify(tokenResult.access_token),
    );
    sessionStorage.removeItem(verifierKey);
    sessionStorage.removeItem(stateKey);

    const returnHash = sessionStorage.getItem(returnHashKey) || "";
    sessionStorage.removeItem(returnHashKey);
    callbackUrl.searchParams.delete("code");
    callbackUrl.searchParams.delete("state");
    callbackUrl.searchParams.delete("error");
    callbackUrl.searchParams.delete("error_description");
    window.history.replaceState(
      null,
      "",
      `${callbackUrl.pathname}${callbackUrl.search}${returnHash}`,
    );
    window.location.reload();
    return;
  }

  const authorizationUrl = new URL(
    `Authorization/${encodeURIComponent(config.Instance)}/Login`,
    oauthServer,
  );
  authorizationUrl.searchParams.set("clientId", clientId);
  const redirectUrl = new URL(window.location.href);
  redirectUrl.hash = "";
  authorizationUrl.searchParams.set("redirectUrl", redirectUrl.toString());
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("code_challenge_method", "s256");
  authorizationUrl.searchParams.set("culture_info", "de-CH");

  authControls.style.display = "flex";
  showTokenButton.addEventListener("click", () => {
    const accessToken = getCurrentAccessToken();
    if (!accessToken) {
      tokenValue.textContent = "No access token is stored.";
    } else {
      try {
        tokenValue.textContent = decodeJwtPayload(accessToken);
      } catch (error) {
        tokenValue.textContent =
          error instanceof Error
            ? error.message
            : "The JWT payload could not be decoded.";
      }
    }
    deleteTokenButton.disabled = accessToken === null;
    revokeTokenButton.disabled = accessToken === null;
    revokeTokenStatus.textContent = "";
    revokeTokenStatus.hidden = true;
    tokenDialog.showModal();
  });
  closeTokenDialogButton.addEventListener("click", () => {
    tokenDialog.close();
  });
  deleteTokenButton.addEventListener("click", () => {
    sessionStorage.removeItem("CLX.LoginToken");
    localStorage.removeItem("CLX.LoginToken");
    tokenDialog.close();
    window.location.reload();
  });
  revokeTokenButton.addEventListener("click", async () => {
    const accessToken = getCurrentAccessToken();
    if (!accessToken) {
      revokeTokenStatus.textContent = "No access token is available to revoke.";
      revokeTokenStatus.hidden = false;
      revokeTokenButton.disabled = true;
      return;
    }

    revokeTokenButton.disabled = true;
    revokeTokenStatus.textContent = "Revoking token...";
    revokeTokenStatus.hidden = false;
    try {
      const revokeUrl = new URL(
        `Authorization/${encodeURIComponent(config.Instance)}/Logout`,
        oauthServer,
      );
      const revokeBody = new URLSearchParams({ access_token: accessToken });
      const response = await fetch(revokeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: revokeBody,
      });
      if (!response.ok) {
        throw new Error(`OAuth logout request failed (${response.status}).`);
      }

      sessionStorage.removeItem("CLX.LoginToken");
      localStorage.removeItem("CLX.LoginToken");
      tokenDialog.close();
      window.location.reload();
    } catch (error) {
      revokeTokenStatus.textContent =
        error instanceof Error
          ? `Could not revoke token: ${error.message}`
          : "Could not revoke token.";
      revokeTokenButton.disabled = false;
    }
  });

  getTokenButton.addEventListener("click", async () => {
    try {
      const codeVerifier = createRandomValue();
      const state = createRandomValue();
      const codeChallenge = await createCodeChallenge(codeVerifier);

      sessionStorage.setItem(verifierKey, codeVerifier);
      sessionStorage.setItem(stateKey, state);
      sessionStorage.setItem(returnHashKey, window.location.hash);
      authorizationUrl.searchParams.set("state", state);
      authorizationUrl.searchParams.set("code_challenge", codeChallenge);
      authorizationUrl.searchParams.set("application_scope", scopeSelect.value);
      window.location.assign(authorizationUrl.toString());
    } catch (error) {
      console.error("Could not start local OAuth login.", error);
    }
  });
}

initializeDevAuth().catch((error) => {
  console.error("Local OAuth login failed.", error);
});
