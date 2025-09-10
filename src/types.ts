export enum Role {
  ADMIN = 'ADMIN',
  TRADER = 'TRADER',
  APPLICANT = 'APPLICANT'
}

export interface User {
  id: string;          // email
  name: string;
  tradingName?: string;
  role: Role;
  isApproved: boolean;
}

export type DayType = 'DAY' | 'NIGHT';
