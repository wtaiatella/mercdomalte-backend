import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import process from 'dotenv/config';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const signAccessToken = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign({ payload }, `${accessTokenSecret}`, {}, (err, token) => {
			if (err) {
				reject(new createError.InternalServerError());
			}
			resolve(token);
		});
	});
};

const verifyAccessToken = (token) => {
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
