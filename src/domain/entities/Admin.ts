export interface Admin {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "staff";
  active: boolean;
  googleId?: string;
  authProvider?: "local" | "google";
  profilePicture?: string;
}
