import { Role, User } from '../types'

const USERS_KEY = 'hcm_users_v1';

export function seedMockDatabase() {
  const existing = localStorage.getItem(USERS_KEY);
  if (existing) return;

  const users: User[] = [
    { id: 'admin@market.com', name: 'Admin User', tradingName: 'Market Admin', role: Role.ADMIN, isApproved: true },
    { id: 'trader1@market.com', name: 'Alice', tradingName: "Alice's Bakery", role: Role.TRADER, isApproved: true },
    { id: 'applicant@market.com', name: 'New Applicant', tradingName: 'TBD', role: Role.APPLICANT, isApproved: false }
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAllUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as User[]; } catch { return []; }
}

export function saveAllUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
