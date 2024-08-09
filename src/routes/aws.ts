import fileService from '@src/services/fileService';
import express from 'express';
import { Request, Response } from 'express';
import logger from '../adapters/logger';

import awsService from '../services/awsService';

const router = express.Router();

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

router.post('/delete', async (req: Request, res: Response) => {
	const { fileName } = req.body;

	logger.debug(req.body);
	logger.debug(fileName);

	try {
		const awsDelete = await awsService.s3delete(fileName);
		logger.info(`\nSuccessfully deleted file in AWS.\n`);
		logger.info(awsDelete);
		const fileDeleted = await fileService.fileDelete(fileName);
		logger.info(`\nSuccessfully deleted file in database.\n`);
		res.json(fileDeleted);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		res.json((e.message = 'Error'));
	}
});

export default router;
