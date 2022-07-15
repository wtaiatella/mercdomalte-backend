import 'dotenv/config';

import express from 'express';
import { Request, Response } from 'express';

import logger from './adapters/logger';

import categoryService from './services/categoryService';
import productService from './services/productService';
import mediaService from './services/mediaService';
import { sendEmail } from './services/emailService';
import { s3getSignedUrl } from './services/awsService';

const app = express();

app.get('/uploadurl', async (req: Request, res: Response) => {
	//const response = await fetch(signedUrl, {method: 'PUT', body: bucketParams.Body});

	const response = await s3getSignedUrl();
	console.log(`\nResponse returned by signed URL: ${response}\n`);

	res.json(response);
});

app.get('/sendemail', async (req: Request, res: Response) => {
	const emailTo = 'asdf@asd.com';
	const respEmail = sendEmail(emailTo);
	res.json(respEmail);
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
