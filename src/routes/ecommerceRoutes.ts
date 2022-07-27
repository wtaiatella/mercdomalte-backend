var express = require('express');
import { Request, Response } from 'express';

import logger from '../adapters/logger';

import categoryService from '../services/categoryService';
import productService from '../services/productService';

var router = express.Router();

//API de referência das aulas AWARI
//Retirar e alterar os testes antes de publicar no portifólio
router.get('/categories', async (_req: Request, res: Response) => {
	const categories = await categoryService.find();

	res.json(categories);
});

router.get('/categories/:id', async (req: Request, res: Response) => {
	const categoryId = req.params.id;

	const category = await categoryService.findOne(categoryId);

	res.json(category);
});

router.get('/categories/:id/products', async (req: Request, res: Response) => {
	const categoryId = req.params.id;

	logger.debug(`categoryId = ${categoryId}`);

	const products = await productService.find(categoryId);

	res.json(products);
});

router.get('/products/:id', async (req: Request, res: Response) => {
	const productId = req.params.id;

	logger.info({ productId });

	const product = await productService.findOne(productId);

	logger.info({ product });

	res.json(product);
});

router.post('/admin/categories', async (_req: Request, res: Response) => {
	res.json({});
});

module.exports = router;
