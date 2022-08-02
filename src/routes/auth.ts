import express from 'express';
import { ErrorRequestHandler, Request, Response } from 'express';
import createError from 'http-errors';
import logger from '../adapters/logger';

import authService from '../services/authService';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// register
router.post(
	'/register',
	async (req, res, next) => {
		logger.info(req.body);
		try {
			const user = await authService.register(req.body);
			logger.info('Usuario cadastrado com sucesso');
			logger.info(user);
			next();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.info('Erro no cadastro de usuário');
			res.status(400).json({
				status: false,
				message: 'Usuario já cadastrado',
				code: 400,
			});
		}
	},
	authMiddleware.authLogin
);

// login
router.post('/login', async (req, res) => {
	try {
		const newRegister = false;
		const data = await authService.login(req.body, newRegister);
		res.status(200).json({
			status: true,
			message: 'Login com sucessos',
			data,
			code: 200,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		//next(createError(e.statusCode, e.message));
		logger.info('Erro de Login');
		logger.info(e);
		res.status(e.statusCode).json({
			status: false,
			message: e.message,
			code: e.statusCode,
		});
	}
});

// all users
router.get('/users', authMiddleware.authGuard, async (req, res, next) => {
	logger.info('Consulta de usuários');
	try {
		const users = await authService.all();
		res.status(200).json({
			status: true,
			message: 'All users',
			data: users,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.info('Erro de consulta');
		next(createError(e.statusCode, e.message));
	}
});

router.get(
	'/check',
	authMiddleware.authGuard,
	async (_req: Request, res: Response) => {
		res.json({ auth: true });
	}
);

router.use(async (_req: Request, res: Response, next) => {
	next(new createError.NotFound('Route not Found'));
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.use(((err: any, req: Request, res: Response) => {
	res.status(err.status || 500).json({
		status: false,
		message: err.message,
	});
}) as ErrorRequestHandler);

export default router;
