export type SessionModel = {
  user: {
    id: string;
    email: string;
    name: string;
    role: number;
    representativeId: number;
    customerId: string;
  };
  token: string;
  refreshToken: string;
};
