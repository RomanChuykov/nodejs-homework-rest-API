const express = require('express')
const logger = require('morgan')
const cors = require('cors')

<<<<<<< Updated upstream
const contactsRouter = require('./routes/api/contacts')

const app = express()
=======
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import router from './routes/api/contacts-routes.js';
import dotenv from 'dotenv';
import { authRouter } from './routes/api/auth-routes.js';
dotenv.config();
const app = express();
>>>>>>> Stashed changes

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
<<<<<<< Updated upstream

app.use('/api/contacts', contactsRouter)
=======
 
app.use('/users',authRouter);
app.use('/api/contacts', router)
>>>>>>> Stashed changes

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
