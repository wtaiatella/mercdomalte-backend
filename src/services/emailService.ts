import NodeMailer from 'nodemailer';
import { google } from 'googleapis';

export async function sendEmail(emailTo: string) {
	const OAuth2 = google.auth.OAuth2;

	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground' // Redirect URL
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN,
	});
	const accessToken = await oauth2Client.getAccessToken();

	let transporter = NodeMailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: 'wtaiatella@gmail.com',
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: accessToken.token ? accessToken.token : '',
		},
	});

	const mailOptions = {
		from: 'wtaiatella@gmail.com',
		to: 'mercdomalte@gmail.com',
		subject: 'Message1',
		text: 'I hope this message gets through!',
	};

	transporter.sendMail(mailOptions, (error, response) => {
		error ? console.log(error) : console.log(response);
		transporter.close();
	});

	return 'email sent';
}
