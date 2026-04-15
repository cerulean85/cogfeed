import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      onboardingCompleted: boolean;
      subscriptionStatus: "free" | "premium" | "expired";
    };
  }

  interface User {
    onboardingCompleted?: boolean;
    subscriptionStatus?: "free" | "premium" | "expired";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    onboardingCompleted?: boolean;
    subscriptionStatus?: "free" | "premium" | "expired";
  }
}
