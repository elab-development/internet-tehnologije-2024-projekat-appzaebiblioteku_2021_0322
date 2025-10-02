import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import genreRoutes from './routes/genre.routes.js';
import bookRoutes from './routes/book.routes.js';
import userRoutes from './routes/user.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
import reportRoutes from './routes/reports.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

app.get('/api', (req, res) => {
  res.send('Fon Library server running');
});

app.use('/api/auth', authRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/reports', reportRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.log('Error connecting to MongoDB: ' + e));

app.listen(PORT, () => {
  console.log(`Fon Library server is running on port ${PORT}`);
});
