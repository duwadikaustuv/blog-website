// Simple in-memory database for demo purposes
// In production, use a real database like PostgreSQL, MongoDB, etc.

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
}

export const users: User[] = [];

export const createUser = async (userData: Omit<User, "id">) => {
  const newUser = {
    id: Math.random().toString(36).substring(7),
    ...userData,
  };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};
