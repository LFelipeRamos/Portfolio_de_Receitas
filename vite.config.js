import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/me': 'http://localhost:3000',
      '/alunos': 'http://localhost:3000',
      '/categorias': 'http://localhost:3000',
      '/habilidades': 'http://localhost:3000',
      '/aluno-habilidades': 'http://localhost:3000',
      '/receitas': 'http://localhost:3000',
      '/comentarios': 'http://localhost:3000',
    },
  },
});
