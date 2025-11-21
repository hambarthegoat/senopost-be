export interface AuthDto {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
}
