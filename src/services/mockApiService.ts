import { User } from '../types';
import { getAllUsers, saveAllUsers } from './seed'

export const apiService = {
  async getUserById(email: string): Promise<User | null> {
    const user = getAllUsers().find(u => u.id.toLowerCase() == email.toLowerCase());
    return user ?? null;
  },
  async getUsers(): Promise<User[]> {
    return getAllUsers();
  },
  async updateUser(updated: User): Promise<void> {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx >= 0) {
      users[idx] = updated;
      saveAllUsers(users);
    } else {
      users.push(updated);
      saveAllUsers(users);
    }
  }
}
