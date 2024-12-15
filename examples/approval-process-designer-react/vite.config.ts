import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/triones-approval-process-designer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@trionesdev/approval-process-designer-react': path.resolve(
          __dirname,
          '../../packages/approval-process-designer-react/src',
      ),
    },
  },
})
