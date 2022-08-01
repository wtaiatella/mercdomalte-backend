import jwt from '../utils/jwt';
import createError from 'http-errors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import logger from '../adapters/logger';

const authGuard: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	logger.info('Middleware de Autenticação');

	if (!req.headers.authorization) {
		logger.info('Cabeçalho sem Autenticação');

		const errAutho = new createError.Unauthorized(
			'Cabeçalho sem Autenticação'
		);
		res.status(errAutho.status || 500).json({
			status: false,
			message: errAutho.message,
		});
	} else {
		logger.info(req.headers.authorization);

		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			logger.info('Token não encontrado');
			const errAutho = new createError.Unauthorized(
				'Token não encontrado'
			);
			res.status(errAutho.status || 500).json({
				status: false,
				message: errAutho.message,
			});
		} else {
			await jwt
				.verifyAccessToken(token)
				.then((user) => {
					//req.user = user;
					console.log(user);
					next();
				})
				.catch(() => {
					logger.info('Token inválido');
					const errAutho = new createError.Unauthorized(
						'Token inválido'
					);
					res.status(errAutho.status || 500).json({
						status: false,
						message: errAutho.message,
					});
				});
		}
	}
};

export default { authGuard };
