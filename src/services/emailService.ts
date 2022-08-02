import NodeMailer from 'nodemailer';
import { google } from 'googleapis';
import logger from '@src/adapters/logger';
import 'dotenv/config';

async function send(emailTo: string) {
	const OAuth2 = google.auth.OAuth2;

	logger.info('Chaves de ambiente');
	logger.info(process.env.GOOGLE_CLIENT_ID);
	logger.info(process.env.GOOGLE_CLIENT_SECRET);
	logger.info(process.env.GOOGLE_REFRESH_TOKEN);
	logger.info(OAuth2);

	const oauth2Client = new OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'https://developers.google.com/oauthplayground' // Redirect URL
	);

	logger.info('Criação de oauth2Client');
	logger.info(oauth2Client);

	oauth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
	});

	const accessToken = await oauth2Client.getAccessToken();

	logger.info('Criação de Chave de acesso');
	logger.info(accessToken);

	const transporter = NodeMailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: 'wtaiatella@gmail.com',
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
			accessToken: accessToken.token ? accessToken.token : '',
		},
	});

	const mailOptions = {
		from: 'wtaiatella@gmail.com',
		//to: 'mercdomalte@gmail.com',
		to: emailTo,
		subject: 'Message1',
		text: 'I hope this message gets through!',
	};

	transporter.sendMail(mailOptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		transporter.close();
	});

	logger.info('Email enviado');

	return 'email sent';
}

export default { send };
