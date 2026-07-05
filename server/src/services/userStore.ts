export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
}

export const users: UserRecord[] = [];
