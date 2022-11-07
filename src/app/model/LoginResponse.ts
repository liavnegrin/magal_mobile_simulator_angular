
export interface LoginResponse {
    SessionId: string;
    SSEChannels: string[];
}

enum LoginStatus {
    PasswordExpired,
    LimitUserSessions
}