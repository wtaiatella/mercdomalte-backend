import express from 'express';
import { Request, Response } from 'express';

import emailService from '../services/emailService';
import logger from '@src/adapters/logger';

const router = express.Router();

router.post('/sendemail', async (req: Request, res: Response) => {
	logger.info('Dados recebidos para envio do Email');
	logger.info(req.body);
	res.json(emailService.send(req.body));
});

export default router;
