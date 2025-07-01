export interface Member {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  documentId?: string;
  birthDate?: Date;
  registrationDate: Date;
  active: boolean;
  password?: string;
  hasAccount?: boolean;
  googleId?: string;
  authProvider?: "local" | "google";
  profilePicture?: string;
  completeProfile?: boolean;
}
