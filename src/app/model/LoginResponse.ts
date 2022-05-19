
export interface LoginResponse {
    SessionId: string;
    SSEChannels: string[];
    Status: LoginStatus;
}

enum LoginStatus {
    Ok,
    PasswordExpired,
    LimitUserSessions
}