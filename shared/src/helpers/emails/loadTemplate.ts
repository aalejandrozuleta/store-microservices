import fs from 'fs';

/**
 * Carga y personaliza una plantilla HTML con las variables proporcionadas.
 *
 * Esta función lee el contenido de un archivo de plantilla y reemplaza las variables
 * delimitadas por `{{clave}}` en el archivo con los valores proporcionados en el objeto
 * `variables`.
 *
 * @param filePath - Ruta absoluta o relativa al archivo de plantilla.
 * @param variables - Objeto con las claves y valores que se utilizarán para reemplazar
 * las variables en la plantilla.
 *
 * @returns Una cadena de texto que contiene el contenido de la plantilla con las
 * variables reemplazadas.
 *
 * @throws Error - Lanza un error si el archivo no se puede leer o si hay problemas
 * con la ruta proporcionada.
 *
 * @example
 *  Contenido de la plantilla (template.html):
 *  "<p>Hola, {{nombre}}. Visita {{enlace}} para más información.</p>"
 *
 * const templatePath = "path/to/template.html";
 * const variables = { nombre: "Juan", enlace: "https://example.com" };
 * const resultado = loadTemplate(templatePath, variables);
 *  Resultado:
 *  "<p>Hola, Juan. Visita https://example.com para más información.</p>"
 */
export function loadTemplate(
  filePath: string,
  variables: Record<string, string>
): string {
  // Lee el contenido del archivo de plantilla.
  let templateContent = fs.readFileSync(filePath, 'utf8');

  // Reemplaza todas las variables del template usando las claves del objeto variables.
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    templateContent = templateContent.replace(regex, value);
  }

  // Devuelve el contenido personalizado.
  return templateContent;
}
