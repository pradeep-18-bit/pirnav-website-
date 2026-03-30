const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "");

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const buildApiUrl = (path) => {
  const normalizedPath = String(path || "").trim();

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (!apiBaseUrl) {
    return normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;
  }

  return `${apiBaseUrl}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

export class ApiError extends Error {
  constructor(message, status, details = null, payload = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.payload = payload;
  }
}

export const isUnauthorizedError = (error) => error instanceof ApiError && error.status === 401;

export const getErrorMessage = (error, fallbackMessage) => {
  if (error instanceof ApiError) {
    return error.message || fallbackMessage;
  }

  return error?.message || fallbackMessage;
};

const createRequestInit = ({ method, headers, body }) => ({
  method,
  headers,
  body,
});

export const jsonRequest = async (path, { method = "GET", body, headers = {} } = {}) => {
  const response = await fetch(
    buildApiUrl(path),
    createRequestInit({
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  );
  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      payload?.message || "Request failed.",
      response.status,
      payload?.errors || null,
      payload
    );
  }

  return payload;
};

export const formRequest = async (path, { method = "POST", body } = {}) => {
  const response = await fetch(
    buildApiUrl(path),
    createRequestInit({
      method,
      headers: {
        Accept: "application/json",
      },
      body,
    })
  );
  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      payload?.message || "Request failed.",
      response.status,
      payload?.errors || null,
      payload
    );
  }

  return payload;
};

export const blobRequest = async (path, { method = "GET", headers = {} } = {}) => {
  const response = await fetch(
    buildApiUrl(path),
    createRequestInit({
      method,
      headers,
    })
  );

  if (!response.ok) {
    const payload = await parseResponseBody(response);
    throw new ApiError(
      payload?.message || "Request failed.",
      response.status,
      payload?.errors || null,
      payload
    );
  }

  return response.blob();
};
