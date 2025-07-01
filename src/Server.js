import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './Routes/Routes.js';
import taskRoutes from './Routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Tarefas!' });
});

// Rotas de Usuário
app.use('/api/users', userRoutes);
// 2. Use as rotas de tarefas
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});