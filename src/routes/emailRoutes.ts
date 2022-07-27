var express = require('express');
import { Request, Response } from 'express';

import logger from '../adapters/logger';

import mediaService from '../services/mediaService';
import emailService from '../services/emailService';

var router = express.Router();

router.get('/sendemail', async (req: Request, res: Response) => {
	const emailTo = 'asdf@asd.com';
	const respEmail = emailService.send(emailTo);
	res.json(respEmail);
});

module.exports = router;
