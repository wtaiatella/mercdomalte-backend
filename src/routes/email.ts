import express from 'express';
import { Request, Response } from 'express';

import emailService from '../services/emailService';

const router = express.Router();

router.get('/sendemail', async (req: Request, res: Response) => {
	const emailTo = 'wtaiatella@yahoo.com.br';
	const respEmail = emailService.send(emailTo);
	res.json(respEmail);
});

export default router;
