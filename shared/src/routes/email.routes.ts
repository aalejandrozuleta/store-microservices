import express, { Router } from 'express';
export const routerEmail: Router = express.Router();

import { emailController } from '@controller/emails/email.controller';
/**
 * @swagger
 * /sendEmail:
 *   post:
 *     summary: Enviar un correo electrónico
 *     description: Envía un correo electrónico utilizando los datos proporcionados en el cuerpo de la solicitud.
 *     tags:
 *       - Emails
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                  email:
 *                    type: string
 *                    description: Dirección de correo electrónico del destinatario.
 *                    example: "destinatario@example.com"
 *                  template:
 *                    type: string
 *                    description: Nombre del archivo de plantilla HTML que se utilizará para el correo.
 *                    example: "welcome-template.html"
 *                  subject:
 *                    type: string
 *                    description: Asunto del correo electrónico.
 *                    example: "Bienvenido a nuestra plataforma"
 *                  variables:
 *                    type: object
 *                    description: Variables dinámicas que se utilizarán para personalizar la plantilla.
 *                    example:
 *                      nombre: "Juan"
 *                      enlace: "https://example.com"
 *       200:
 *         description: Correo enviado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Correo enviado correctamente"
 *       500:
 *         description: Error al enviar el correo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al enviar correo: ..."
 */
routerEmail.post('/sendEmail', emailController);
