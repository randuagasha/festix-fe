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

export type UpdateProfileInput = {
  fullName?: string;
  avatar?: File | null;
};

export async function updateMe(
  input: UpdateProfileInput,
): Promise<CurrentUser> {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  if (input.fullName !== undefined) {
    formData.append("fullName", input.fullName.trim());
  }
  if (input.avatar) {
    formData.append("avatar", input.avatar);
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove("token");
    }
    const message =
      (Array.isArray(json?.message) ? json?.message[0] : json?.message) ||
      "Failed to update profile";
    throw new Error(message);
  }

  return json.data;
}

export type ChangePasswordInput = {
  newPassword: string;
  currentPassword?: string;
  otpCode?: string;
};

export async function sendChangePasswordOtp(): Promise<{ message: string; email: string }> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/auth/change-password/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove("token");
    }
    const message =
      (Array.isArray(json?.message) ? json?.message[0] : json?.message) ||
      "Failed to send OTP code";
    throw new Error(message);
  }

  return json;
}

export async function changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      Cookies.remove("token");
    }
    const message =
      (Array.isArray(json?.message) ? json?.message[0] : json?.message) ||
      "Failed to change password";
    throw new Error(message);
  }

  return json;
}
