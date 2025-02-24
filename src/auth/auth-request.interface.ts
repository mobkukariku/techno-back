import { Request } from 'express';
import { Role } from '@prisma/client'; // или путь к твоему enum Role

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}
