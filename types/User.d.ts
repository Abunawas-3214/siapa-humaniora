export type User = {
  id: string;
  name: string;
  jabatan?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  password: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};