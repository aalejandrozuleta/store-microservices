export interface CustomError {
  status: number;
  data: { error: string } | string; // Dependiendo de cómo recibas el error, puede ser un objeto con un campo `error` o simplemente un string
}
