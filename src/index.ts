import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import servicesRoutes from './routes/services';
import profileRoutes from './routes/professional';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/services', servicesRoutes);
app.use('/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Terceriza P2P rodando na porta ${PORT}`);
});
