import 'express-async-errors'
import * as dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan';
import { nanoid } from 'nanoid';
//routers
import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import mongoose from 'mongoose'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

dotenv.config()
const app = express()

app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  // routers
  app.use('/api/v1/jobs', jobRouter)
  app.use('/api/v1/auth', authRouter)

  app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found'})
  })

  app.use(errorHandlerMiddleware)

  const port = process.env.port || 5100

    try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`server running on PORT ${port}....`);
    });
    } catch (error) {
    console.log(error);
    process.exit(1);
    }