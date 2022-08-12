import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import { database } from './../adapters/database';
import logger from './../adapters/logger';

import jwt from '../utils/jwt';

interface userProps {
	name: string;
	email: string;
	password: string;
}

interface updatePasswordProps {
	name: string;
	email: string;
	password: string;
	passwordnew: string;
}

const login = async (data: userProps, newRegister: boolean) => {
	const { email, password } = data;
	logger.info('Busca de usuario para login');
	logger.info(`email: ${data.email}`);

	const userFound = await database.user.findUnique({
		where: {
			email,
		},
	});

	let user: userProps;
	if (userFound) {
		user = {
			name: `${userFound.name}`,
			email: `${userFound.email}`,
			password: `${userFound.password}`,
		};
	} else {
		user = {
			name: '',
			email: '',
			password: '',
		};
	}

	logger.info('Retorno do usuario');
	logger.info(user);

	if (!user.email) {
		logger.info('Usuário não registrado');

		throw new createError.NotFound('Usuário não registrado');
	}

	const checkPassword = newRegister
		? true
		: bcrypt.compareSync(`${password}`, `${user.password}`);

	if (!checkPassword) {
		logger.info('Senha incorreta');
		throw new createError.Unauthorized('Senha incorreta');
	}

	const accessToken = await jwt.signAccessToken(user);

	return { ...user, accessToken };
};

const register = async (data: userProps) => {
	data.password = bcrypt.hashSync(`${data.password}`, 8);

	const user = await database.user.create({
		data,
	});

	logger.info('Retorno criação usuário');
	logger.info({ user });

	if (!user) {
		throw new createError.BadRequest('Usuário ja registrado');
	}

	return user;
};

const updatePassword = async (dataUpdate: updatePasswordProps) => {
	const data: userProps = {
		name: dataUpdate.name,
		email: dataUpdate.email,
		password: dataUpdate.passwordnew,
	};
	data.password = bcrypt.hashSync(`${data.password}`, 8);

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

const updateData = async (userData: userProps) => {
	const { email, name, password } = userData;
	const data: userProps = {
		email,
		name,
		password,
	};
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

export default { register, login, all, updatePassword, updateData };
