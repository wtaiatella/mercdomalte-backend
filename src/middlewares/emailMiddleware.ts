//import createError from 'http-errors';
import { Request, RequestHandler, Response } from 'express';
import logger from '../adapters/logger';
import emailService from '@src/services/emailService';
import { database } from './../adapters/database';

const sendPassword: RequestHandler = async (
	req: Request,
	res: Response,
	next
) => {
	logger.info('Middleware para envio de senha');

	const { email, password } = req.body;
	const emailTo = `${email}`;
	const subject = 'Recuperação de senha';
	const html = `<h2>Olá cervejeiro,</h2>
	
<p>Você está recebendo este e-mail porque solicitou uma nova senha em nosso site.</p>
	
<p>Nova senha: <strong>${password}</strong></p>

<p>Sua senha está exposta neste e-mail, por isso recomentamos a atualização da mesma no seu painel de controle.</p>

<p>Atenciosamente</p>

<p>Mercado do Malte</p>
`;
	const emailData = {
		emailTo,
		subject,
		html,
	};
	logger.info(emailData);

	try {
		await database.user.findUnique({
			where: {
				email,
			},
		});

		await emailService.send(emailData);
		logger.info('Middleware - Email enviado');
		next();
	} catch (e) {
		res.status(503).json({
			status: false,
			message: 'Erro no envio de e-mail',
			code: 503,
		});
	}
};

export default { sendPassword };
