export interface JwtPayload {
  username: string;
  name: string;
  description: string;
  birthdate: string;
  gender: string;
  email: string;
  sub: string; // 'sub' is the user identifier
}
