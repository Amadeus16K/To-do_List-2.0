import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = Router();

// Aplicar o middleware 'protect' a todas as rotas abaixo
// Isso garante que apenas usuários logados possam acessar os endpoints de tarefas.
router.use(protect);

// Rotas do CRUD de Tarefas
router.route('/')
  .post(createTask) // POST /api/tasks -> Criar uma nova tarefa
  .get(getTasks);   // GET /api/tasks -> Listar todas as tarefas do usuário logado

router.route('/:id')
  .get(getTaskById)    // GET /api/tasks/:id -> Obter uma tarefa específica
  .put(updateTask)     // PUT /api/tasks/:id -> Atualizar uma tarefa específica
  .delete(deleteTask); // DELETE /api/tasks/:id -> Deletar uma tarefa específica

export default router;