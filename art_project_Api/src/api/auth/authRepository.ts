import { User } from './authModels';

export const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAdmin: true,
    password: 'password',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAdmin: false,
    password: 'password',
  },
];

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return users;
  },

  findByIdAsync: async (id: number): Promise<User | null> => {
    return users.find((user) => user.id === id) || null;
  },

  findByEmailAsync: async (email: string): Promise<User | null> => {
    return users.find((user) => user.email === email) || null;
  },

  createUser: async (user: User) => {
    users.push(user);
  },

  updateTokenByEnail: async (email: string, token: string) => {
    const user = users.find((user) => user.email === email);
    if (user) {
      user.token = token;
    }
  },

  getNewId: async (): Promise<number> => {
    return users.length + 1;
  },
};
