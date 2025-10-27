import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentFilePath = path.join(__dirname, 'src', 'content.mdx');

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsxImportSource: 'solid-js/h',
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        providerImportSource: 'solid-mdx',
      }),
      enforce: 'pre',
    },
    solidPlugin({
      extensions: ['.jsx', '.tsx', '.md', '.mdx'],
    }),
    // API endpoints plugin - заменяет отдельный Express сервер
    {
      name: 'mdx-file-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // GET /api/load - загрузка файла
          if (req.url === '/api/load' && req.method === 'GET') {
            try {
              const content = fs.readFileSync(contentFilePath, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ content }));
            } catch (error) {
              console.error('Error loading file:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to load file.' }));
            }
            return;
          }

          // POST /api/save - сохранение файла
          if (req.url === '/api/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { content } = JSON.parse(body);
                if (content === undefined) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Content is missing' }));
                  return;
                }
                fs.writeFileSync(contentFilePath, content, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'File saved successfully.' }));
              } catch (error) {
                console.error('Error saving file:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to save file.' }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
