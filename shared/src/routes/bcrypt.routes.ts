import express, { Router } from 'express';
export const routerBcrypt: Router = express.Router();
import { hashPasswordController } from '@controller/bcrypt/hashPasswordController';

/**
 * @swagger
 * /hashPassword:
 *   post:
 *     summary: Generar un hash de una contraseña
 *     description: Esta ruta permite recibir una contraseña y devolver un hash seguro utilizando bcrypt.
 *     tags:
 *       - Bcrypt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: La contraseña que se desea hashear.
 *                 example: "miContraseña123"
 *     responses:
 *       200:
 *         description: Hash generado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hash:
 *                   type: string
 *                   description: El hash generado de la contraseña.
 *                   example: "$2b$10$abcdefg12345"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error del servidor.
 *                   example: "Error al generar el hash."
 */

routerBcrypt.use('/hashPassword', hashPasswordController);