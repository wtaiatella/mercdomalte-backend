import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import logger from '../adapters/logger';

import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

interface userProps {
	name: string;
	email: string;
	password: string;
}

const signAccessToken = (payload: userProps) => {
	logger.info(accessTokenSecret);
	return new Promise((resolve, reject) => {
		jwt.sign({ payload }, `${accessTokenSecret}`, {}, (err, token) => {
			if (err) {
				reject(new createError.InternalServerError());
			}
			resolve(token);
		});
	});
};

const verifyAccessToken = (token: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, `${accessTokenSecret}`, (err, payload) => {
			if (err) {
				const message =
					err.name == 'JsonWebTokenError'
						? 'Unauthorized'
						: err.message;
				return reject(new createError.Unauthorized(message));
			}
			resolve(payload);
		});
	});
};

export default { signAccessToken, verifyAccessToken };
