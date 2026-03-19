import { fail } from '../utils/response.js';

export function errorHandler(error, req, res, next) {
  console.error('[API ERROR]', error);

  if (error?.code === 'P2002') {
    return fail(res, 409, 'Registro duplicado para campo único.', error.meta);
  }

  if (error?.code === 'P2025') {
    return fail(res, 404, 'Registro não encontrado.');
  }

  return fail(res, 500, 'Erro interno do servidor.');
}
