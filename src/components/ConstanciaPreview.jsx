import { forwardRef } from 'react';
import LogoA from '@/assets/logos/LogoA';
import firma from '@/assets/firma-presidente.png';
import { COURSE } from '@/config/course';

const DOC_LABEL = {
  CC: 'cédula de ciudadanía',
  TI: 'tarjeta de identidad',
  CE: 'cédula de extranjería',
};

/**
 * ConstanciaPreview — Constancia en formato A4 horizontal (297mm x 210mm).
 * Debe renderizarse fuera de pantalla con ancho fijo en px para captura con html2canvas.
 * 297mm @ 96dpi ≈ 1123px · 210mm @ 96dpi ≈ 794px
 */
const ConstanciaPreview = forwardRef(({ nombre, documento, tipoDocumento, sesiones, folio }, ref) => {
  const docLabel = DOC_LABEL[tipoDocumento] || 'documento de identidad';
  const fechaEmision = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      ref={ref}
      style={{
        width: '1123px',
        height: '794px',
        position: 'relative',
        background: '#fff',
        fontFamily: 'Montserrat, Arial, sans-serif',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, border: '10px solid #0F1B2D' }} />
      <div style={{ position: 'absolute', inset: '20px', border: '2px solid #F1C717' }} />

      <div style={{
        position: 'absolute', top: '-140px', right: '-140px', width: '360px', height: '360px',
        background: 'linear-gradient(135deg, #4995F3 0%, #4977DC 100%)', borderRadius: '50%', opacity: 0.12,
      }} />
      <div style={{
        position: 'absolute', bottom: '-160px', left: '-160px', width: '380px', height: '380px',
        background: '#F1C717', borderRadius: '50%', opacity: 0.08,
      }} />

      <div style={{
        position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '38px 80px 26px', textAlign: 'center', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <LogoA width={62} height={69} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 900, fontSize: '19px', color: '#0F1B2D', letterSpacing: '0.5px' }}>
              TRANSFORMACIÓN ESTUDIANTIL
            </div>
            <div style={{ fontWeight: 500, fontSize: '13px', color: '#4977DC', letterSpacing: '0.3px' }}>
              {COURSE.institucion}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', fontSize: '16px', fontWeight: 800, letterSpacing: '5px', color: '#4977DC' }}>
          CONSTANCIA DE PARTICIPACIÓN
        </div>

        <div style={{
          marginTop: '20px', fontFamily: 'Lora, Georgia, serif', fontWeight: 600, fontSize: '19px', color: '#444',
        }}>
          Transformación Estudiantil hace constar que
        </div>

        <div style={{
          marginTop: '10px', fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontStyle: 'italic',
          fontSize: '50px', lineHeight: 1.15, color: '#0F1B2D', borderBottom: '3px solid #F1C717',
          paddingBottom: '8px', maxWidth: '900px',
        }}>
          {nombre}
        </div>

        <div style={{ marginTop: '12px', fontSize: '16px', color: '#666' }}>
          identificado(a) con {docLabel} No. <strong style={{ color: '#222' }}>{documento}</strong>
        </div>

        <div style={{ marginTop: '22px', fontSize: '18px', color: '#333', maxWidth: '900px', lineHeight: 1.6 }}>
          participó en el curso <strong>«{COURSE.nombre}»</strong>, organizado por {COURSE.organiza},{' '}
          {COURSE.institucion}, cumpliendo con la asistencia requerida para esta constancia.
        </div>

        {/* Franja de datos del curso */}
        <div style={{
          marginTop: '26px', width: '100%', display: 'flex', background: '#0F1B2D', borderRadius: '10px',
          overflow: 'hidden', borderBottom: '5px solid #F1C717',
        }}>
          {[
            ['CURSO', 'Excel Básico'],
            ['PERÍODO', COURSE.periodo],
            ['MODALIDAD', COURSE.modalidad],
          ].map(([label, value], i) => (
            <div key={label} style={{
              flex: 1, padding: '15px 8px', borderLeft: i ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#F1C717' }}>{label}</div>
              <div style={{ marginTop: '5px', fontSize: '19px', fontWeight: 800, color: '#fff' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Firma única */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <img
            src={firma}
            alt="Firma"
            style={{ height: '125px', display: 'block', margin: '0 auto -18px', position: 'relative' }}
          />
          <div style={{ width: '300px', borderTop: '1.5px solid #222', paddingTop: '7px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F1B2D' }}>{COURSE.firmante.nombre}</div>
            <div style={{ fontSize: '12.5px', color: '#666' }}>{COURSE.firmante.cargo}</div>
          </div>
        </div>

        <div style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid #e5e5e5', paddingTop: '10px', fontSize: '11px', color: '#888',
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          <span>{COURSE.ciudad} · {fechaEmision}</span>
          <span>Folio: {folio}</span>
        </div>
      </div>
    </div>
  );
});

ConstanciaPreview.displayName = 'ConstanciaPreview';
export default ConstanciaPreview;
