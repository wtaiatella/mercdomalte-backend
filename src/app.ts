import express from 'express';

const cors = require('cors');

//require Routes
const authRouter = require('./routes/authRoutes');
const fileRouter = require('./routes/fileRoutes');
const awsRouter = require('./routes/awsRoutes');
const emailRouter = require('./routes/emailRoutes');
const ecommerceRouter = require('./routes/ecommerceRoutes');

const app = express();

var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', authRouter);
app.use('/', fileRouter);
app.use('/', awsRouter);
app.use('/', emailRouter);

export default app;
