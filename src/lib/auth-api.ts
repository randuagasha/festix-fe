import Cookies from "js-cookie";
import { API_URL } from "../../api";

export type CurrentUser = {
  userId: string;
  email: string;
  role: string;
  fullName?: string | null;
  avatar?: string | null;
};

export async function getMe(): Promise<CurrentUser | null> {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove("token");
      }
      return null;
    }

    const json = await response.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
