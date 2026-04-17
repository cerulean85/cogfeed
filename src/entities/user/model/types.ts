export type User = {
  id: string;
  email: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  token: string;
  userId: string;
  createdAt: string;
};
