import express from 'express';
import path from 'path';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// REGISTRO DE ROTAS
app.use('/', publicRoutes);
app.use('/', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Terceriza rodando e modularizado na porta ${PORT}`);
});
