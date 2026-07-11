export type CreateOwnerAccountInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateOwnerAccountResult = {
  id: string;
  email: string;
  role: "owner";
  isApproved: boolean;
};

export type FirebaseAdminError = {
  code?: string;
  message?: string;
};

export type ResendVerificationEmailInput = {
  uid: string;
  email: string;
};

export type ResendVerificationEmailResult = {
  emailVerified: boolean;
  resent: boolean;
};
