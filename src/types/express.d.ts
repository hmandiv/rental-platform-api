export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        role: string;
        isApproved: boolean;
        name: string;
        email: string;
      };
    }
  }
}
