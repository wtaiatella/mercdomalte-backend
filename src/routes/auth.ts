import express from 'express';
import { ErrorRequestHandler, Request, Response } from 'express';
import createError from 'http-errors';

import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

//check jwt
router.get(
	'/check',
	authMiddleware.authGuard,
	async (_req: Request, res: Response) => {
		res.json({ auth: true });
	}
);

//create error with any other address
router.use(async (_req: Request, res: Response, next) => {
	next(new createError.NotFound('Route not Found'));
});

//handle error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.use(((err: any, req: Request, res: Response) => {
	res.status(err.status || 500).json({
		status: false,
		message: err.message,
	});
}) as ErrorRequestHandler);

export default router;
