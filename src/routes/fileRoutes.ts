var express = require('express');
import { Request, Response } from 'express';

import logger from '../adapters/logger';

import mediaService from '../services/mediaService';

var router = express.Router();

router.get('/medias', async (req: Request, res: Response) => {
	const medias = await mediaService.findMedias();
	logger.debug(`aqui estão as Medias:`);
	logger.debug(medias);
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

router.post('/medias', async (req: Request, res: Response) => {
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

router.get('/mediascategories', async (req: Request, res: Response) => {
	const categories = await mediaService.findCategories();
	console.log(`aqui estão as Medias:`);
	console.log(categories);
	res.json(categories);
});

//Verify if slug exist
//medias/slug/${fileSlug}
router.get('/medias/slug/:slug', async (req: Request, res: Response) => {
	const fileSlug = req.params.slug;
	console.log(fileSlug);

	const medias = await mediaService.findSlug(fileSlug);
	console.log(`aqui estão as Medias:`);
	console.log(medias);
	res.json(medias);
});

module.exports = router;
