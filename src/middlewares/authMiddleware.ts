import jwt from '../utils/jwt';
import createError from 'http-errors';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import logger from '../adapters/logger';
import userService from '@src/services/userService';

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

		const token: string = req.headers.authorization.split(' ')[1];
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

const authLogin: RequestHandler = async (req: Request, res: Response) => {
	logger.info('Login após registro');
	try {
		const newRegister = true;
		const data = await userService.login(req.body, newRegister);
		res.status(200).json({
			status: true,
			message: 'Login com sucessos',
			data,
			code: 200,
		});
		logger.info('Login com sucesso');
		logger.info(data);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.info('Erro de Login');
		logger.info(e);
		res.status(e.statusCode).json({
			status: false,
			message: e.message,
			code: e.statusCode,
		});
	}
};

export default { authGuard, authLogin };
