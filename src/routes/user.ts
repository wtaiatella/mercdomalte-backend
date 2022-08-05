import express from 'express';
import { ErrorRequestHandler, Request, Response } from 'express';
import createError from 'http-errors';
import logger from '../adapters/logger';

import userService from '../services/userService';
import authMiddleware from '../middlewares/authMiddleware';
import emailMiddleware from '../middlewares/emailMiddleware';

const router = express.Router();

interface userProps {
	name: string;
	email: string;
	password?: string;
	accessToken?: string;
}

// login
router.post('/login', async (req, res) => {
	try {
		const newRegister = false;
		const data = await userService.login(req.body, newRegister);
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

// register
router.post(
	'/register',
	async (req, res, next) => {
		logger.info(req.body);
		try {
			const user = await userService.register(req.body);
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

// Renew password and send e-mail
router.put(
	'/recoverypassword',
	emailMiddleware.sendPassword,
	async (req, res) => {
		logger.info(req.body);
		try {
			const user = await userService.updatePassword(req.body);
			logger.info('Senha atualizada com sucesso');
			logger.info(user);
			res.status(200).json({
				status: true,
				message: 'Senha atualizada com sucesso',
				code: 200,
				data: user,
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.info('Erro na atualização de usuário');
			res.status(400).json({
				status: false,
				message: 'Erro na atualização de usuário',
				code: 400,
			});
		}
	},
	emailMiddleware.sendPassword
);

// Update data
router.put('/update', async (req, res) => {
	logger.info(req.body);
	try {
		const user = await userService.updateData(req.body);
		logger.info('User atualizado com sucesso');
		logger.info(user);
		res.status(200).json({
			status: true,
			message: 'User atualizado com sucesso',
			code: 200,
			data: user,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		logger.info('Erro na atualização de usuário');
		res.status(400).json({
			status: false,
			message: 'Erro na atualização de usuário',
			code: 400,
		});
	}
});

// Update passwpord
router.put(
	'/updatepassword',

	async (req, res) => {
		logger.info(req.body);
		try {
			const newRegister = false;
			const { name, email, password, passwordnew } = req.body;
			const checkPassword: userProps = {
				name,
				email,
				password,
			};

			await userService.login(checkPassword, newRegister);
			logger.info('Senha atual conferida');
			const updatePassword = {
				email,
				password,
				passwordnew,
			};

			const user = await userService.updatePassword(updatePassword);
			logger.info('Senha atualizada com sucesso');
			logger.info(user);
			res.status(200).json({
				status: true,
				message: 'Senha atualizada com sucesso',
				code: 200,
				data: user,
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (e: any) {
			logger.info('Erro na atualização de usuário');
			res.status(400).json({
				status: false,
				message: 'Erro na atualização de usuário',
				code: 400,
			});
		}
	},
	emailMiddleware.sendPassword
);

// all users
router.get('/users', authMiddleware.authGuard, async (req, res, next) => {
	logger.info('Consulta de usuários');
	try {
		const users = await userService.all();
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

//create error with any other address
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
