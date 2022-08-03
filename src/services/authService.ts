import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import { database } from './../adapters/database';
import logger from './../adapters/logger';

import jwt from '../utils/jwt';

interface dataProps {
	email: string;
	password: string;
}

const login = async (data: dataProps, newRegister: boolean) => {
	const { email, password } = data;
	logger.info('Busca de usuario para login');
	logger.info(`email: ${data.email}`);

	const user = await database.user.findUnique({
		where: {
			email,
		},
	});

	logger.info('Retorno do usuario');
	logger.info(user);

	if (!user) {
		logger.info('Usuário não registrado');

		throw new createError.NotFound('Usuário não registrado');
	}

	const checkPassword = newRegister
		? true
		: bcrypt.compareSync(password, `${user.password}`);

	if (!checkPassword) {
		logger.info('Senha incorreta');
		throw new createError.Unauthorized('Senha incorreta');
	}

	//delete user.password;

	const accessToken = await jwt.signAccessToken(user);

	return { ...user, accessToken };
};

const register = async (data: dataProps) => {
	data.password = bcrypt.hashSync(data.password, 8);

	const user = await database.user.create({
		data,
	});
	//user.accessToken = await jwt.signAccessToken(user);
	logger.info('Retorno criação usuário');
	logger.info({ user });

	if (!user) {
		throw new createError.BadRequest('Usuário ja registrado');
	}

	return user;
};

const update = async (data: dataProps) => {
	data.password = bcrypt.hashSync(data.password, 8);

	const user = await database.user.update({
		where: {
			email: data.email,
		},
		data,
	});
	logger.info('Retorno atualização usuário');
	logger.info({ user });

	if (!user) {
		throw new createError.BadRequest('E-mail não encontrado');
	}

	return user;
};

const all = async () => {
	const allUsers = await database.user.findMany();

	return allUsers;
};

export default { register, login, all, update };
