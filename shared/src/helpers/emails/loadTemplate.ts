import fs from 'fs';

export function loadTemplate(filePath: string, variables: Record<string, string>): string {
  let templateContent = fs.readFileSync(filePath, 'utf8');

  // Reemplazar todas las variables del template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    templateContent = templateContent.replace(regex, value);
  }

  return templateContent;
}