import { Router } from 'express';
import * as userController from '../Controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = Router();

router.post('/register', userController.register);

// E aqui declaramos a rota de login
router.post('/login', userController.login);

// Rotas protegidas
// Para acessar esta rota, o usuário PRECISARÁ ter um token válido.
// O middleware 'protect' é colocado ANTES da função do controller.
router.get('/me', protect, userController.getUserProfile);

export default router;