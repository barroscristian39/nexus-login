import jwt from 'jsonwebtoken';
import { fail } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus-dev-secret';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 401, 'Token de acesso ausente.');
  }

  const token = header.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return fail(res, 401, 'Token inválido ou expirado.');
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user?.perfil || !roles.includes(req.user.perfil)) {
      return fail(res, 403, 'Você não tem permissão para esta ação.');
    }
    return next();
  };
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}
