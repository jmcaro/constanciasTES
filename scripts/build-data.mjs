// Convierte la hoja "Consolidado" del Excel de asistencia en src/data/estudiantes.json.
// El número de documento NUNCA se guarda en texto plano: se usa su hash SHA-256 como
// clave, para que el archivo publicado no exponga la lista de cédulas/nombres.
//
// Uso:
//   node scripts/build-data.mjs "/ruta/al/Registro de asistencia....xlsx"
//
// Si no se pasa ruta, busca por defecto en data/registro-asistencia.xlsx

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = process.argv[2] || path.join(__dirname, '..', 'data', 'registro-asistencia.xlsx');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'estudiantes.json');
const SHEET_NAME = 'Consolidado';

function normalizeDocumento(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function hashDocumento(value) {
  return createHash('sha256').update(normalizeDocumento(value)).digest('hex');
}

const workbook = XLSX.readFile(inputPath);
const sheet = workbook.Sheets[SHEET_NAME];
if (!sheet) {
  console.error(`No se encontró la hoja "${SHEET_NAME}" en ${inputPath}. Hojas disponibles: ${workbook.SheetNames.join(', ')}`);
  process.exit(1);
}

const rows = XLSX.utils.sheet_to_json(sheet, { defval: 0 });

const estudiantes = {};
let count = 0;
let skipped = 0;

for (const row of rows) {
  const documento = row['No. Documento'];
  const nombre = row['Nombre completo'];
  if (!documento || !nombre) { skipped++; continue; }

  const key = hashDocumento(documento);
  estudiantes[key] = {
    nombre: String(nombre).trim().replace(/\s+/g, ' '),
    tipoDocumento: String(row['Tipo Documento'] || 'CC').trim(),
    calidad: String(row['Calidad de participante'] || '').trim(),
    sesiones: Number(row['Total sesiones asistidas'] || 0),
  };
  count++;
}

writeFileSync(outputPath, JSON.stringify(estudiantes, null, 2));
console.log(`✔ ${count} estudiantes escritos en ${path.relative(process.cwd(), outputPath)} (omitidos: ${skipped})`);
