var express = require('express');
import { Request, Response } from 'express';

import logger from '../adapters/logger';

import awsService from '../services/awsService';

var router = express.Router();

router.post('/uploadurl', async (req: Request, res: Response) => {
	const { fileName } = req.body;

	logger.debug(req.body);
	logger.debug(fileName);
	const response = await awsService.getUploadSignedUrl(fileName);
	logger.debug(`\nResponse returned by signed URL: ${response}\n`);

	res.json(response);
	//res.json(fileName);
});

router.post('/downloadurl', async (req: Request, res: Response) => {
	const { fileName } = req.body;

	logger.debug(req.body);
	logger.debug(fileName);
	const url = await awsService.getDownloadSignedUrl(fileName);
	logger.debug(`\nResponse returned by signed URL: ${url}\n`);

	res.json(url);
	//res.json(fileName);
});

module.exports = router;
