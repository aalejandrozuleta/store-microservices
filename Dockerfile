# Usa Node.js como base para el entorno de desarrollo
FROM node:22

# Establece el directorio de trabajo en la raíz del proyecto
WORKDIR /app

# Actualiza los repositorios e instala zsh
RUN apt-get update && apt-get install -y zsh

# Cambia la shell predeterminada del usuario a zsh
RUN chsh -s /bin/zsh root

# Comando por defecto para que el contenedor no se cierre inmediatamente
CMD ["tail", "-f", "/dev/null"]