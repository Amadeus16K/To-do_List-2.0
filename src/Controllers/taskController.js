import db from '../Config/database.js';

// @desc    Criar uma nova tarefa
// @route   POST /api/tasks
// @access  Privado
export const createTask = async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  const userId = req.user.id; // O ID do usuário vem do middleware 'protect'

  if (!title) {
    return res.status(400).json({ message: 'O título é obrigatório.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, status, priority, due_date, userId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// @desc    Listar todas as tarefas do usuário logado
// @route   GET /api/tasks
// @access  Privado
export const getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// @desc    Obter uma tarefa específica pelo ID
// @route   GET /api/tasks/:id
// @access  Privado
export const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = rows[0];

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    // VERIFICAÇÃO DE POSSE: Garante que o usuário só pode ver sua própria tarefa
    if (task.user_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para ver esta tarefa.' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// @desc    Atualizar uma tarefa
// @route   PUT /api/tasks/:id
// @access  Privado
export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, status, priority, due_date } = req.body;

  try {
    // Primeiro, busca a tarefa para garantir que ela existe e pertence ao usuário
    const { rows: existingTasks } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = existingTasks[0];

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    if (task.user_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Atualiza a tarefa
    const { rows: updatedTasks } = await db.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [title || task.title, description || task.description, status || task.status, priority || task.priority, due_date || task.due_date, taskId]
    );

    res.status(200).json(updatedTasks[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// @desc    Deletar uma tarefa
// @route   DELETE /api/tasks/:id
// @access  Privado
export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const { rows: existingTasks } = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = existingTasks[0];

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    if (task.user_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    res.status(200).json({ message: 'Tarefa deletada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};