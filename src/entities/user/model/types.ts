export type User = {
  id: string;
  email: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  theme: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};
