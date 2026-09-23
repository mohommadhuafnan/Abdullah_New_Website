export function normalizeEmail(email: string): string;
export function maskEmail(email: string): string;
export function requestOtp(args: { email?: string; ip: string }): Promise<{ status: number; body: any }>;
export function resendOtp(args: { challengeId?: string; ip: string }): Promise<{ status: number; body: any }>;
export function verifyOtp(args: { challengeId?: string; otp: string; ip: string }): Promise<{ status: number; body: any; token?: string }>;
export function verifySession(token: string | null): { authenticated: boolean; email?: string };
export function logoutSession(token: string | null): boolean;
