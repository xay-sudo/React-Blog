
import type { User } from '@/types';

// Define users array (previously in posts.ts)
export const users: User[] = [
  { id: '1', name: 'xay', email: 'vanchhaydok@gmail.com' }, // Admin user
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Chaplin', email: 'charlie@example.com' },
];

// Simulate a logged-in admin user
export const MOCK_ADMIN_USER_ID = '1'; // 'xay' (user ID '1') is the admin

export const getCurrentUser = (): User | undefined => {
  // In a real app, this would come from an auth session
  // For mock purposes, if mockAdminLoggedIn is true, we assume it's the admin user.
  if (typeof window !== 'undefined' && localStorage.getItem('mockAdminLoggedIn') === 'true') {
    return users.find(user => user.id === MOCK_ADMIN_USER_ID);
  }
  // Fallback or if used in server context where localStorage isn't available for this check
  // For server actions triggered by an admin, this still works.
  return users.find(user => user.id === MOCK_ADMIN_USER_ID);
};

export const isAdmin = (userId?: string): boolean => {
  if (!userId) return false;
  return userId === MOCK_ADMIN_USER_ID;
};
