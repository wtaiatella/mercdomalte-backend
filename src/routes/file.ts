import express from 'express';
import { Request, Response } from 'express';

import logger from '../adapters/logger';

import fileService from '../services/fileService';

const router = express.Router();

interface fileProps {
	title: string;
	name: string;
	slug: string;
	icon: string;
	type: string;
	size: number;
	categoryId: string;
	email: string;
}

router.get('/', async (req: Request, res: Response) => {
	logger.debug(`aqui estão os Files:`);
	const files = await fileService.findFiles();
	logger.debug(files);
	res.json(files);
});

router.get('/user/:id', async (req: Request, res: Response) => {
	const userId = req.params.id;

	const files = await fileService.findByUser(userId);
	logger.debug(`aqui estão os Files:`);
	logger.debug(files);
	res.json(files);
});

router.post('/', async (req: Request, res: Response) => {
	console.log(req.body);
	const { title, name, slug, icon, type, size, categoryId, email } = req.body;

	const file: fileProps = {
		title,
		name,
		slug,
		icon,
		type,
		size,
		categoryId,
		email,
	};

	try {
		const fileCreated = await fileService.create(file);
		res.json({ fileCreated });
	} catch (err) {
		res.status(400);
		//res.json({ err: 'Invalid name' });
	}
});

router.get('/categories', async (req: Request, res: Response) => {
	const categories = await fileService.findCategories();
	console.log(`aqui estão os Files:`);
	console.log(categories);
	res.json(categories);
});

//Verify if slug exist
//files/slug/${fileSlug}
router.get('/slug/:slug', async (req: Request, res: Response) => {
	const fileSlug = req.params.slug;
	console.log(fileSlug);

	const files = await fileService.findSlug(fileSlug);
	console.log(`aqui estão os Files:`);
	console.log(files);
	res.json(files);
});

export default router;
