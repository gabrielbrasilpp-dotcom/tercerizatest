import express from 'express'; 
import userRoutes from './users'; 
import serviceRoutes from './services'; 
 
const app = express(); 
 
app.use(express.json()); 
app.use(userRoutes); 
app.use(serviceRoutes); 
 
app.get('/', (req, res) => { res.json({ message: 'API TERCERIZA ok' }); }); 
 
app.listen(3000, () => console.log( 'SERVIDOR_RODANDO_NA_PORTA_3000' ));
