import Cookies from "js-cookie";
import { API_URL } from "../../api";

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = Cookies.get("token");

  if (!token) {
    throw new AdminApiError("Authentication required", 401);
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type") &&
    options.method &&
    options.method !== "GET"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      if (data && typeof data.message === "string") {
        message = data.message;
      } else if (data && Array.isArray(data.message)) {
        message = data.message.join(", ");
      }
    } catch {
      // response is not json
    }
    throw new AdminApiError(message, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
