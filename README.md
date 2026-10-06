# Constancias — Excel Básico (Transformación Estudiantil)

App para que los estudiantes descarguen su constancia en PDF del curso **"Excel Básico: Paso a Paso"**
ingresando su número de documento. Solo pueden descargarlo quienes asistieron a **2 o más sesiones**.

Es una app 100% estática (sin backend, sin base de datos): los datos de asistencia se convierten
una vez a un archivo JSON y quedan empaquetados en la app.

## Privacidad de los datos

El archivo `src/data/estudiantes.json` **no guarda las cédulas en texto plano**: cada registro se
indexa por el hash SHA-256 del documento. Así, alguien que inspeccione el código de la app no puede
ver la lista de cédulas/nombres — solo se puede "abrir" un registro si ya se conoce el número exacto.

## Actualizar los datos de asistencia

1. Exporta/descarga el Excel de asistencia actualizado (hoja **"Consolidado"** con columnas
   `No. Documento`, `Nombre completo`, `Tipo Documento`, `Calidad de participante` y
   `Total sesiones asistidas`).
2. Corre:
   ```bash
   npm run build-data -- "/ruta/al/Registro de asistencia....xlsx"
   ```
3. Esto regenera `src/data/estudiantes.json`. Vuelve a compilar/desplegar la app.

## Configurar el curso

Edita `src/config/course.js` para cambiar nombre del curso, período, número mínimo de sesiones,
institución y firmante de la constancia.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
```

## Compilar para producción

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente para probar
```

`dist/` es una carpeta 100% estática: se puede desplegar en Netlify, Vercel, GitHub Pages, o
cualquier hosting estático. Debe servirse por **HTTPS** (o `localhost`) porque el hasheo de la
cédula usa `crypto.subtle`, que requiere un contexto seguro.

## Despliegue en Railway

Railway detecta Node automáticamente: ejecuta `npm run build` y luego `npm start`
(`scripts/serve.mjs`, un servidor estático sin dependencias que sirve `dist/` en `$PORT`).
No requiere variables de entorno. Cada `git push` a `main` redespliega la app.
