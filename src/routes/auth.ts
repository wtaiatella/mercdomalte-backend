import express from 'express';
import { ErrorRequestHandler, Request, Response } from 'express';
import createError from 'http-errors';
import logger from '../adapters/logger';

import authService from '../services/authService';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// register
router.post('/register', async (req, res) => {
	logger.info(req.body);
	try {
		const user = await authService.register(req.body);
		res.status(200).json({
			status: true,
			message: 'Usuário cadastrado com sucesso',
			data: user,
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.info('Erro no cadastro de usuário');
		res.status(400).json({
			status: true,
			message: 'Usuario já cadastrado',
		});
	}
});

// login
router.post('/login', async (req, res) => {
	try {
		const data = await authService.login(req.body);
		res.status(200).json({
			status: true,
			message: 'Login com sucessos',
			data,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		//next(createError(e.statusCode, e.message));
		logger.info('Erro de Login');
		logger.info(e);
		res.status(e.statusCode).json({
			status: true,
			message: e.message,
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

router.use(async (req: Request, res: Response, next) => {
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
