import db from '../Config/database.js'; // Note a extensão .js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const { rows: existingUsers } = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { rows: newUser } = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: newUser[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validação simples
  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    // 2. Encontrar o usuário pelo e-mail
    const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = users[0];

    if (!user) {
      // Mensagem genérica para não informar se o e-mail existe ou não (mais seguro)
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Comparar a senha fornecida com a senha criptografada no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 4. Gerar o Token JWT
    // O token vai "carregar" o ID do usuário. Usamos isso depois para saber quem fez a requisição.
    const token = jwt.sign(
      { id: user.id, name: user.name }, // Carga útil (payload)
      process.env.JWT_SECRET,           // Chave secreta do .env
      { expiresIn: '8h' }               // Opções (ex: token expira em 8 horas)
    );

    // 5. Enviar a resposta com o token
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};

export const getUserProfile = async (req, res) => {
  // O middleware 'protect' já fez a busca pelo usuário e o anexou em 'req.user'.
  // Se chegamos até aqui, o usuário está autenticado com certeza.
  res.status(200).json(req.user);
};