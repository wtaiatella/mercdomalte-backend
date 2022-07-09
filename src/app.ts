import 'dotenv/config';

import express from 'express';
import { Request, Response } from 'express';

import logger from './adapters/logger';

import categoryService from '@src/services/categoryService';
import productService from '@src/services/productService';
import mediaService from '@src/services/mediaService';

import NodeMailer from 'nodemailer';
import { google } from 'googleapis';

const app = express();

app.get('/sendemail', async (req: Request, res: Response) => {
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
});

app.get('/medias', async (req: Request, res: Response) => {
	const medias = await mediaService.findMedias();
	console.log(`aqui estão as Medias:`);
	console.log(medias);
	res.json(medias);
});

app.get('/categories', async (_req: Request, res: Response) => {
	const categories = await categoryService.find();

	res.json(categories);
});

app.get('/categories/:id', async (req: Request, res: Response) => {
	const categoryId = req.params.id;

	const category = await categoryService.findOne(categoryId);

	res.json(category);
});

app.get('/categories/:id/products', async (req: Request, res: Response) => {
	const categoryId = req.params.id;

	logger.debug(`categoryId = ${categoryId}`);

	const products = await productService.find(categoryId);

	res.json(products);
});

app.get('/products/:id', async (req: Request, res: Response) => {
	const productId = req.params.id;

	logger.info({ productId });

	const product = await productService.findOne(productId);

	logger.info({ product });

	res.json(product);
});

app.post('/admin/categories', async (_req: Request, res: Response) => {
	res.json({});
});

export default app;
