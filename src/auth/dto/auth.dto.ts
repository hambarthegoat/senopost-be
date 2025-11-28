export interface AuthDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string | null;
  user_id: string | null;
}
