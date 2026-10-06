// Servidor estático mínimo para producción (Railway): sirve dist/ con fallback a index.html.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function load(urlPath) {
  const filePath = path.join(root, path.normalize(urlPath));
  if (!filePath.startsWith(root + path.sep)) return null;
  try {
    return { filePath, body: await readFile(filePath) };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  let file = await load(decodeURIComponent(pathname));
  if (!file) file = await load('/index.html');
  if (!file) {
    res.writeHead(500).end('Build no encontrado: ejecuta npm run build');
    return;
  }
  const isAsset = file.filePath.includes(`${path.sep}assets${path.sep}`);
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file.filePath)] || 'application/octet-stream',
    'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(file.body);
}).listen(port, '0.0.0.0', () => console.log(`Sirviendo dist/ en el puerto ${port}`));
