import type { User } from './user';

export type AuthCodeData = {
  provider: string;
  code: string;
};

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

// export type Role = {
//   id: string;
//   name: string;
//   description: string;
//   permissions: Permission[];
// };

// export type Permission = {
//   id: string;
//   effect: string;
//   action: string;
//   resource: string;
//   filterResource: string;
//   filterType: string;
//   filterValue: string;
// };
