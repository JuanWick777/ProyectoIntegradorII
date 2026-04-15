import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Tag } from 'lucide-react';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

const EMPTY_PROMO = {
  titulo: '',
  descripcion: '',
  tipoDescuento: 'PORCENTAJE',
  valorDescuento: '',
  codigoPromo: '',
  categoriaId: '',
  activa: true,
  fechaInicio: '',
  fechaFin: '',
};

const validate = (form) => {
  const errs = {};
  const is2x1 = String(form.tipoDescuento || '').toUpperCase() === '2X1';

  if (!form.titulo?.trim()) errs.titulo = 'El título es obligatorio.';
  else if (form.titulo.trim().length < 3) errs.titulo = 'El título debe tener al menos 3 caracteres.';

  if (!is2x1) {
    if (!form.valorDescuento && form.valorDescuento !== 0)
      errs.valorDescuento = 'El valor del descuento es obligatorio.';
    else if (isNaN(Number(form.valorDescuento)) || Number(form.valorDescuento) <= 0)
      errs.valorDescuento = 'El valor debe ser un número positivo.';
    else if (form.tipoDescuento === 'PORCENTAJE' && Number(form.valorDescuento) > 100)
      errs.valorDescuento = 'El porcentaje no puede ser mayor a 100.';
  }

  if (is2x1 && !form.codigoPromo?.trim())
    errs.codigoPromo = 'El código es obligatorio para promociones 2x1.';

  if (is2x1 && !form.categoriaId)
    errs.categoriaId = 'La categoría es obligatoria para promociones 2x1.';

  if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio)
    errs.fechaFin = 'La fecha de fin no puede ser anterior a la fecha de inicio.';

  return errs;
};

const PromoModal = ({ promo, categorias = [], onSave, onClose, saving }) => {
  const isNew = !promo?.id;
  const [form, setForm] = useState(promo ? { ...EMPTY_PROMO, ...promo } : EMPTY_PROMO);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(promo ? { ...EMPTY_PROMO, ...promo } : EMPTY_PROMO);
    setErrors({});
    setTouched({});
  }, [promo]);

  const set = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = () => {
    setTouched({ titulo: true, valorDescuento: true, codigoPromo: true, categoriaId: true, fechaFin: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(form);
  };

  const is2x1 = String(form.tipoDescuento || '').toUpperCase() === '2X1';

  const fc = (field) =>
    `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] && (form[field] !== '' && form[field] !== undefined) ? 'is-valid' : ''}`;

  const fs = (field) =>
    `form-select ${touched[field] && errors[field] ? 'is-invalid' : ''}`;

  const errMsg = (field) =>
    touched[field] && errors[field] ? (
      <div className="invalid-feedback d-flex align-items-center gap-1 mt-1">
        <span>⚠</span> {errors[field]}
      </div>
    ) : null;

  return (
    <Modal
      title={
        isNew
          ? <><Tag size={20} className="me-2" />Nueva Promoción</>
          : <><Edit2 size={20} className="me-2" />Editar Promoción</>
      }
      onClose={onClose}
      closeOnBackdrop
      size="md"
      bodyClassName="pt-2"
      footerClassName="border-0 pt-0"
      footer={(
        <div className="d-flex gap-3 justify-content-end">
          <SecondaryButton
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{ borderRadius: '0.75rem', minWidth: '120px' }}
          >
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            type="button"
            className="fw-bold"
            style={{ borderRadius: '0.75rem', minWidth: '120px' }}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving
              ? <><LoadingSpinner size="sm" className="me-2" variant="light" />Guardando...</>
              : isNew ? <><Plus size={18} /> Crear</> : <><Save size={18} /> Guardar</>}
          </PrimaryButton>
        </div>
      )}
    >
      {/* Título */}
      <div className="mb-3">
        <label htmlFor="promo-titulo" className="form-label fw-semibold small">
          Título <span className="text-danger">*</span>
        </label>
        <input
          id="promo-titulo"
          className={fc('titulo')}
          value={form.titulo}
          onChange={(e) => set('titulo', e.target.value)}
          onBlur={() => handleBlur('titulo')}
          placeholder="Ej. Promo del día"
        />
        {errMsg('titulo')}
      </div>

      {/* Descripción */}
      <div className="mb-3">
        <label htmlFor="promo-descripcion" className="form-label fw-semibold small">Descripción</label>
        <textarea
          id="promo-descripcion"
          className="form-control"
          rows={2}
          value={form.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          placeholder="Detalles visibles para el cliente..."
        />
      </div>

      {/* Tipo y Valor */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <label htmlFor="promo-tipo" className="form-label fw-semibold small">Tipo de descuento</label>
          <select
            id="promo-tipo"
            className="form-select"
            value={form.tipoDescuento}
            onChange={(e) => {
              const next = e.target.value;
              set('tipoDescuento', next);
              if (String(next).toUpperCase() === '2X1') set('valorDescuento', 0);
            }}
          >
            <option value="PORCENTAJE">% Porcentaje</option>
            <option value="MONTO_FIJO">$ Monto fijo</option>
            <option value="2X1">2x1 (por categoría)</option>
          </select>
        </div>
        <div className="col-6">
          <label htmlFor="promo-valor" className="form-label fw-semibold small">
            Valor {form.tipoDescuento === 'PORCENTAJE' ? '(%)' : '($)'}
            {!is2x1 && <span className="text-danger ms-1">*</span>}
          </label>
          <input
            id="promo-valor"
            type="number"
            className={fc('valorDescuento')}
            value={form.valorDescuento}
            disabled={is2x1}
            onKeyDown={(e) => {
              if (['+', '-', 'e', 'E'].includes(e.key)) e.preventDefault();
            }}
            onChange={(e) => set('valorDescuento', e.target.value)}
            onBlur={() => handleBlur('valorDescuento')}
            placeholder="Ej. 10"
            step="0.01"
            min="0"
          />
          {errMsg('valorDescuento')}
          {is2x1 && (
            <div className="form-text">El descuento 2x1 se calcula automáticamente.</div>
          )}
        </div>
      </div>

      {/* Categoría */}
      <div className="mb-3">
        <label htmlFor="promo-categoria" className="form-label fw-semibold small">
          {is2x1 ? <>Categoría <span className="text-danger">*</span></> : 'Categoría (opcional)'}
        </label>
        <select
          id="promo-categoria"
          className={fs('categoriaId')}
          value={form.categoriaId ?? ''}
          onChange={(e) => {
            set('categoriaId', e.target.value);
            setTouched((p) => ({ ...p, categoriaId: true }));
          }}
          onBlur={() => handleBlur('categoriaId')}
        >
          <option value="">— Sin categoría —</option>
          {(categorias || []).map((c) => (
            <option key={c.id} value={String(c.id)}>{c.nombre}</option>
          ))}
        </select>
        {errMsg('categoriaId')}
        {!errors.categoriaId && (
          <div className="form-text text-muted">
            {is2x1
              ? 'La promo 2x1 solo aplica a platillos de esta categoría.'
              : 'Si eliges una categoría, la promo solo afectará platillos de esa categoría.'}
          </div>
        )}
      </div>

      {/* Código */}
      <div className="mb-3">
        <label htmlFor="promo-codigo" className="form-label fw-semibold small">
          {is2x1 ? <>Código <span className="text-danger">*</span></> : 'Código (opcional)'}
        </label>
        <input
          id="promo-codigo"
          className={fc('codigoPromo')}
          value={form.codigoPromo}
          onKeyDown={(e) => {
            // Bloquear signos matemáticos y espacios en el código
            if (['+', '-', ' '].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => set('codigoPromo', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          onBlur={() => handleBlur('codigoPromo')}
          placeholder="Ej. PROMO10"
          style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
        />
        {errMsg('codigoPromo')}
        {!errors.codigoPromo && (
          <div className="form-text text-muted">
            {is2x1
              ? 'Para 2x1 se requiere un código único alfanumérico.'
              : 'Solo letras y números, sin espacios ni caracteres especiales.'}
          </div>
        )}
      </div>

      {/* Fechas */}
      <div className="row g-3 mb-3">
        <div className="col-6">
          <label htmlFor="promo-fecha-inicio" className="form-label fw-semibold small">Fecha inicio</label>
          <input
            id="promo-fecha-inicio"
            type="date"
            className="form-control"
            value={form.fechaInicio || ''}
            onChange={(e) => {
              set('fechaInicio', e.target.value);
              // Re-validar fecha fin si ya fue tocada
              if (touched.fechaFin) {
                const errs = validate({ ...form, fechaInicio: e.target.value });
                setErrors((prev) => ({ ...prev, fechaFin: errs.fechaFin }));
              }
            }}
          />
        </div>
        <div className="col-6">
          <label htmlFor="promo-fecha-fin" className="form-label fw-semibold small">Fecha fin</label>
          <input
            id="promo-fecha-fin"
            type="date"
            className={`form-control ${touched.fechaFin && errors.fechaFin ? 'is-invalid' : ''}`}
            value={form.fechaFin || ''}
            onChange={(e) => set('fechaFin', e.target.value)}
            onBlur={() => handleBlur('fechaFin')}
          />
          {errMsg('fechaFin')}
        </div>
      </div>

      {/* Activa */}
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="promoActiva"
          checked={!!form.activa}
          onChange={(e) => set('activa', e.target.checked)}
        />
        <label className="form-check-label fw-semibold small" htmlFor="promoActiva">
          Promoción activa
        </label>
      </div>
    </Modal>
  );
};

export default PromoModal;
