import { EmailsInterface } from "@interfaces/emails.interface";
import { emailService } from "@services/emails/email.service";
import { Request, Response } from "express";

export const emailController = async (req:Request, res:Response) => {
  const data = req.body.data as EmailsInterface;
  try {
    await emailService(data);
    res.status(200).send({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).send({ message: error });
  }
};