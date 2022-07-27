import 'dotenv/config';

import express from 'express';
import { Request, Response } from 'express';

import logger from './adapters/logger';

import categoryService from './services/categoryService';
import productService from './services/productService';
import mediaService from './services/mediaService';
import { sendEmail } from './services/emailService';
import {
	s3getUploadSignedUrl,
	s3getDownloadSignedUrl,
} from './services/awsService';
const authRouter = require('./routes/auth');
const cors = require('cors');

const app = express();

var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', authRouter);

app.post('/uploadurl', cors(), async (req: Request, res: Response) => {
	const { fileName } = req.body;

	logger.debug(req.body);
	logger.debug(fileName);
	const response = await s3getUploadSignedUrl(fileName);
	logger.debug(`\nResponse returned by signed URL: ${response}\n`);

	res.json(response);
	//res.json(fileName);
});

app.post('/downloadurl', cors(), async (req: Request, res: Response) => {
	const { fileName } = req.body;

	logger.debug(req.body);
	logger.debug(fileName);
	const url = await s3getDownloadSignedUrl(fileName);
	logger.debug(`\nResponse returned by signed URL: ${url}\n`);

	res.json(url);
	//res.json(fileName);
});

app.get('/medias', async (req: Request, res: Response) => {
	const medias = await mediaService.findMedias();
	console.log(`aqui estão as Medias:`);
	console.log(medias);
	res.json(medias);
});

interface mediaProps {
	title: string;
	name: string;
	slug: string;
	icon: string;
	type: string;
	size: number;
	categoryId: string;
}

app.post('/medias', async (req: Request, res: Response) => {
	console.log(req.body);
	const { title, name, slug, icon, type, size, categoryId } = req.body;
	const media: mediaProps = {
		title,
		name,
		slug,
		icon,
		type,
		size,
		categoryId,
	};

	try {
		const category = await mediaService.create(media);
		res.json({ title });
	} catch (err) {
		res.status(400);
		//res.json({ err: 'Invalid name' });
	}
});

app.get('/mediascategories', async (req: Request, res: Response) => {
	const categories = await mediaService.findCategories();
	console.log(`aqui estão as Medias:`);
	console.log(categories);
	res.json(categories);
});

//Verify if slug exist
//medias/slug/${fileSlug}
app.get('/medias/slug/:slug', async (req: Request, res: Response) => {
	const fileSlug = req.params.slug;
	console.log(fileSlug);

	const medias = await mediaService.findSlug(fileSlug);
	console.log(`aqui estão as Medias:`);
	console.log(medias);
	res.json(medias);
});

app.get('/sendemail', async (req: Request, res: Response) => {
	const emailTo = 'asdf@asd.com';
	const respEmail = sendEmail(emailTo);
	res.json(respEmail);
});

//API de referência das aulas AWARI
//Retirar e alterar os testes antes de publicar no portifólio
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
