import jwt from 'jsonwebtoken';
import db from '../Config/database.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Verificar se o cabeçalho de autorização existe e começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extrair o token do cabeçalho (ex: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar e decodificar o token usando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Anexar os dados do usuário à requisição (sem a senha)
      // O 'decoded.id' vem do payload que criamos durante o login
      const { rows } = await db.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
      req.user = rows[0];

      // 5. Chamar a próxima função no ciclo da requisição
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token inválido.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token encontrado.' });
  }
};