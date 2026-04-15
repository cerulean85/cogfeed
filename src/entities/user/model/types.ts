export type SubscriptionTier = "free" | "premium";
export type SubscriptionStatus = "active" | "expired" | "canceled";

export type Subscription = {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  subscription: Subscription;
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};
