import type { User } from './user';

export type AuthCodeData = { provider: string; code: string };

export type Session = {
  id: string;
  expiry: string;
};

export type AuthCodeResponse = {
  user: User;
  session: Session;
};

export type UserCredentials = {
  userId: string;
  sessionToken: string;
};
