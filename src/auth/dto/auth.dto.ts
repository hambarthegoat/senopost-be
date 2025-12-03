export interface AuthDto {
  email: string;
  password: string;
  username: string;
}

export interface LoginResponse {
  token: string | null;
  user_id: string | null;
}
