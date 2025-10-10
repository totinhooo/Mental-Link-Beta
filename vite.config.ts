
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // Map Figma asset imports to local files
        'figma:asset/eafbf3cbd73202cb4317c654f8816344093bb9f7.png': path.resolve(__dirname, './src/assets/eafbf3cbd73202cb4317c654f8816344093bb9f7.png'),
        'figma:asset/d9f3413577834151f481b2330404507b220e52d6.png': path.resolve(__dirname, './src/assets/d9f3413577834151f481b2330404507b220e52d6.png'),
        'figma:asset/7f894c8252ee503e03eae1186a98ae9ff28e8d17.png': path.resolve(__dirname, './src/assets/7f894c8252ee503e03eae1186a98ae9ff28e8d17.png'),
        'figma:asset/2f24f54a2d5cf83a8750b8e1e9d21cc57b297441.png': path.resolve(__dirname, './src/assets/2f24f54a2d5cf83a8750b8e1e9d21cc57b297441.png'),
        'figma:asset/2dbc6e4b8804b5a91432dbdc31008769164c72a3.png': path.resolve(__dirname, './src/assets/2dbc6e4b8804b5a91432dbdc31008769164c72a3.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });