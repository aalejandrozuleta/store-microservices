export function generateCode(length: number): string {
  const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const aleatoryIndex = Math.floor(Math.random() * character.length);
    code += character.charAt(aleatoryIndex);
  }

  return code;
}
