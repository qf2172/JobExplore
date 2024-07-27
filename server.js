import 'express-async-errors'
import * as dotenv from 'dotenv'
import express from 'express'
dotenv.config()
const app = express()

import morgan from 'morgan';
import { nanoid } from 'nanoid';
//routers
import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import mongoose from 'mongoose'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(cookieParser());

app.use(express.json())
app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});
  // routers
  app.use('/api/v1/jobs', authenticateUser,jobRouter)
  app.use('/api/v1/auth', authRouter) // public router, let all the user do that
  app.use('/api/v1/users', authenticateUser, userRouter )

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