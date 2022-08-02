/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import cors from 'cors';

//require Routes
import authRouter from './routes/auth';
import fileRouter from './routes/file';
import awsRouter from './routes/aws';
import emailRouter from './routes/email';
import ecommerceRouter from './routes/ecommerce';
const app = express();

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/file', fileRouter);
app.use('/aws', awsRouter);
app.use('/email', emailRouter);
app.use('/', ecommerceRouter);

export default app;
