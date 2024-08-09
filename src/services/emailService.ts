import NodeMailer from 'nodemailer';
import { google } from 'googleapis';
import logger from '@src/adapters/logger';
import 'dotenv/config';

interface emailProps {
	emailTo: string;
	subject: string;
	html: string;
}

async function send(emailData: emailProps) {
	const OAuth2 = google.auth.OAuth2;

	logger.info('Service - send email');

	const oauth2Client = new OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'https://developers.google.com/oauthplayground' // Redirect URL
	);

	logger.info('Service - Criação de oauth2Client');
	//logger.info(oauth2Client);

	oauth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
	});

	const accessToken = await oauth2Client.getAccessToken();

	logger.info('Service - Criação de Chave de acesso');
	//logger.info(accessToken);

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
		from: 'Mercado do Malte <wtaiatella@gmail.com>',
		to: emailData.emailTo,
		subject: emailData.subject,
		html: emailData.html,
	};

	transporter.sendMail(mailOptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		transporter.close();
	});

	logger.info('Service - Email enviado');

	return 'email sent';
}

export default { send };
