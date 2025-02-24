import express, { Router } from 'express';
export const routerUser: Router = express.Router();

import { registerController } from '@controller/user/register.controller';
import { registerValidator } from '@middleware/user/register.middleware';

/**
 *
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Registra un nuevo usuario con los datos proporcionados en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - birthdate
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Perez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               password:
 *                 type: string
 *                 example: "Contraseña@123"
 *               role:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 2
 *                   - 3
 *                   - 4
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Validación fallida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ocurrió un error desconocido"
 */

routerUser.post('/register', registerValidator, registerController);

import { authController } from '@controller/user/auth.controller';
import { authValidator } from '@middleware/user/auth.middleware';
routerUser.post('/auth', authValidator, authController);

import { refreshAccessToken } from '@controller/user/refreshAccessToken';
routerUser.post('/refresh', refreshAccessToken);

import { twoFactorController } from '@controller/user/2fa.controller';
routerUser.post('/2fa', twoFactorController);
