import { useRef, useState } from 'react';
import LogoA from '@/assets/logos/LogoA';
import ConstanciaPreview from '@/components/ConstanciaPreview';
import { COURSE } from '@/config/course';
import { hashDocumento, normalizeDocumento } from '@/utils/hash';
import estudiantes from '@/data/estudiantes.json';

// 'idle' | 'loading' | 'not-found' | 'insufficient' | 'ready'
export default function App() {
  const [documento, setDocumento] = useState('');
  const [status, setStatus] = useState('idle');
  const [record, setRecord] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = normalizeDocumento(documento);
    if (!clean) return;

    setStatus('loading');
    setRecord(null);

    const key = await hashDocumento(clean);
    const found = estudiantes[key];

    if (!found) {
      setStatus('not-found');
      return;
    }
    if (found.sesiones < COURSE.sesionesMinimas) {
      setRecord({ ...found, documento: clean });
      setStatus('insufficient');
      return;
    }

    setRecord({ ...found, documento: clean });
    setStatus('ready');
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(cardRef.current, { scale: 2.5, useCORS: true, backgroundColor: '#fff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      const safeName = record.nombre.replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      pdf.save(`constancia-excel-tes-${safeName}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const folio = record ? `TES-${record.documento.slice(-4)}-${new Date().getFullYear()}` : '';

  return (
    <div className="min-h-screen bg-te-bg flex flex-col items-center px-4 py-10">
      <header className="flex items-center gap-3 mb-8">
        <LogoA width={44} height={50} />
        <div className="text-left">
          <div className="font-display font-black text-te-ink text-sm tracking-wide">TRANSFORMACIÓN ESTUDIANTIL</div>
          <div className="text-te-blue-mid text-xs font-medium">{COURSE.institucion}</div>
        </div>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-7">
          <h1 className="font-display font-black text-te-text text-xl leading-tight">
            Constancia — {COURSE.nombre}
          </h1>
          <p className="text-te-muted text-sm mt-2">
            Ingresa tu número de documento para verificar tu asistencia y descargar tu constancia en PDF.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Número de documento (sin puntos)"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-full rounded-lg border border-black/10 px-4 py-3 text-te-text text-sm focus:outline-none focus:ring-2 focus:ring-te-blue"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !normalizeDocumento(documento)}
              className="w-full rounded-lg bg-te-gradient-h text-white font-bold text-sm py-3 disabled:opacity-50 transition"
            >
              {status === 'loading' ? 'Consultando…' : 'Consultar constancia'}
            </button>
          </form>

          {status === 'not-found' && (
            <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              No encontramos ese número de documento en el registro del curso <strong>{COURSE.nombre}</strong>.
              Verifica que esté bien escrito o contáctanos si crees que es un error.
            </div>
          )}

          {status === 'insufficient' && record && (
            <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
              Hola <strong>{record.nombre.split(' ')[0]}</strong>, registramos tu asistencia a{' '}
              <strong>{record.sesiones} de {COURSE.totalSesiones}</strong> sesiones. La constancia requiere un
              mínimo de <strong>{COURSE.sesionesMinimas} sesiones</strong>, así que aún no está disponible para ti.
            </div>
          )}

          {status === 'ready' && record && (
            <div className="mt-5 rounded-lg bg-te-blue-light border border-te-blue/20 text-te-text text-sm px-4 py-3">
              <p>
                ¡Felicitaciones <strong>{record.nombre.split(' ')[0]}</strong>! Asististe a{' '}
                <strong>{record.sesiones} de {COURSE.totalSesiones}</strong> sesiones. Tu constancia ya está lista.
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="mt-3 w-full rounded-lg bg-te-yellow text-te-ink font-bold text-sm py-3 disabled:opacity-60 transition"
              >
                {downloading ? 'Generando PDF…' : 'Descargar constancia (PDF)'}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-te-muted mt-6">
          {COURSE.organiza} · {COURSE.institucion}
        </p>
      </main>

      {/* Constancia renderizada fuera de pantalla para captura con html2canvas */}
      {status === 'ready' && record && (
        <div style={{ position: 'fixed', top: 0, left: '-99999px' }}>
          <ConstanciaPreview
            ref={cardRef}
            nombre={record.nombre}
            documento={record.documento}
            tipoDocumento={record.tipoDocumento}
            sesiones={record.sesiones}
            folio={folio}
          />
        </div>
      )}
    </div>
  );
}
