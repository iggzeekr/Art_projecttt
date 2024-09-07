import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

import { LoginResponse } from './authDto';
import { User } from './authModels';
import { userRepository } from './authRepository';

const SECRET_KEY = 'random_string_best_friend_is_a_cigaratte';

export const authService = {
  register: async (user: User): Promise<ServiceResponse<User | null>> => {
    // check if the user is in the db
    const userExist = await userRepository.findByEmailAsync(user.email);
    if (userExist !== null) {
      return new ServiceResponse<User>(ResponseStatus.Failed, 'User already exist', user, StatusCodes.BAD_REQUEST);
    }

    // create a new user
    user.isAdmin = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.token = '';
    user.id = await userRepository.getNewId();
    await userRepository.createUser(user);
    return new ServiceResponse<User>(ResponseStatus.Success, 'User registered successfully', user, StatusCodes.CREATED);
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmailAsync(email);

    if (!user) {
      return new ServiceResponse<LoginResponse | null>(
        ResponseStatus.Failed,
        'User not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    // check if the password is correct
    if (user.password !== password) {
      return new ServiceResponse<LoginResponse | null>(
        ResponseStatus.Failed,
        'Incorrect password',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    const userEmail = user.email;
    // Generate JWT token
    const token = jwt.sign({ userEmail }, SECRET_KEY, { expiresIn: '24h' });
    userRepository.updateTokenByEnail(userEmail, token);

    return new ServiceResponse<LoginResponse | null>(
      ResponseStatus.Success,
      'User logged in successfully',
      { token: token },
      StatusCodes.OK
    );
  },

  authenticateToken: (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
      req.user = user;
      next();
    });
  },

  authenticateAdmin: (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
      if (user.isAdmin) {
        req.user = user;
        next();
      } else {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
    });
  },
};
