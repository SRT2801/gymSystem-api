import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { AdminRepository } from "@infrastructure/repositories/AdminRepository";
import { MemberRepository } from "@infrastructure/repositories/MemberRepository";
import { AuthService } from "@application/services/AuthService";

const adminRepository = new AdminRepository();
const memberRepository = new MemberRepository();
const authService = new AuthService(adminRepository, memberRepository);

export const setupPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const googleUserData = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profilePicture: profile.photos?.[0]?.value,
          };

          if (!googleUserData.email) {
            return done(
              new Error("No se pudo obtener el email del perfil de Google")
            );
          }

          const role = "member";

          try {
            const { user, role: userRole } =
              await authService.findOrCreateGoogleUser(
                googleUserData,
                role as "member" | "admin" | "staff"
              );

            if (!user || !user.id) {
              console.error(
                "Usuario sin ID después de findOrCreateGoogleUser:",
                user
              );
              return done(new Error("El usuario no tiene un id válido"));
            }

            return done(null, {
              user,
              role: userRole,
            } as unknown as Express.User);
          } catch (error) {
            console.error("Error durante findOrCreateGoogleUser:", error);
            return done(error);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((userObj: any, done) => {
    done(null, userObj as unknown as Express.User);
  });

  passport.deserializeUser(async (serializedUser: any, done) => {
    done(null, serializedUser as unknown as Express.User);
  });
};
