export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; 
  role: "admin" | "staff" | "member";
  active: boolean;
  googleId?: string;
  authProvider?: "local" | "google";
  profilePicture?: string;
}
