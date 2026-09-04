import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import servicesRoutes from './routes/services';
import companyRoutes from './routes/company';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Redirecionamento da raiz
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Registro de Rotas
app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/services', servicesRoutes);
app.use('/', companyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
