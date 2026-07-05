import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import snippetsRoutes from './routes/snippetsRoutes.js';
import sqlqueriesRoutes from './routes/sqlqueriesRoutes.js';
import apicollectionsRoutes from './routes/apicollectionsRoutes.js';
import resourcesRoutes from './routes/resourcesRoutes.js';
import terminalCommandsRoutes from './routes/terminalCommandsRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/snippets', snippetsRoutes);
app.use('/api/sqlqueries', sqlqueriesRoutes);
app.use('/api/apicollections', apicollectionsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/terminalcommands', terminalCommandsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/profile', profileRoutes);

export { app };
