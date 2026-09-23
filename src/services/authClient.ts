// Client-side authentication service communicating with /api/admin/auth endpoints

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  challengeId?: string;
  maskedEmail?: string;
  expiresIn?: number;
  error?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  email?: string;
  token?: string;
  error?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  email?: string;
}

const getStoredToken = (): string | null => {
  try {
    return sessionStorage.getItem('admin_bearer_token');
  } catch {
    return null;
  }
};

const setStoredToken = (token: string | null) => {
  try {
    if (token) {
      sessionStorage.setItem('admin_bearer_token', token);
    } else {
      sessionStorage.removeItem('admin_bearer_token');
    }
  } catch {
    // Ignore storage errors
  }
};

export const AuthClient = {
  async requestOtp(email: string): Promise<RequestOtpResponse> {
    try {
      const res = await fetch('/api/admin/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to send verification code.', error: data.error };
      }
      return { success: true, ...data };
    } catch {
      return { success: false, message: 'Unable to contact the authentication service. Please try again.', error: 'Network error' };
    }
  },

  async resendOtp(challengeId: string): Promise<RequestOtpResponse> {
    try {
      const res = await fetch('/api/admin/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to resend verification code.', error: data.error };
      }
      return { success: true, ...data };
    } catch {
      return { success: false, message: 'Unable to contact the authentication service. Please try again.', error: 'Network error' };
    }
  },

  async verifyOtp(challengeId: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, otp: otp.trim() }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Verification failed.', error: data.error };
      }
      if (data.token) {
        setStoredToken(data.token);
      }
      return { success: true, ...data };
    } catch {
      return { success: false, message: 'Unable to contact the authentication service. Please try again.', error: 'Network error' };
    }
  },

  async checkSession(): Promise<SessionResponse> {
    try {
      const token = getStoredToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/admin/auth/session', {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      if (!res.ok) {
        setStoredToken(null);
        return { authenticated: false };
      }
      const data = await res.json();
      return { authenticated: !!data.authenticated, email: data.email };
    } catch {
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    try {
      const token = getStoredToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch {
      // Ignore
    } finally {
      setStoredToken(null);
    }
  }
};
