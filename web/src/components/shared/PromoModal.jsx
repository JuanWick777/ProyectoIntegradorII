import React, { useEffect, useState } from 'react';
import { Edit2, Plus, Save, Tag } from 'lucide-react';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import LoadingSpinner from '../ui/LoadingSpinner';

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

const PromoModal = ({ promo, categorias = [], onSave, onClose, saving }) => {
  const isNew = !promo?.id;
  const [form, setForm] = useState(promo ? { ...EMPTY_PROMO, ...promo } : EMPTY_PROMO);

  useEffect(() => {
    setForm(promo ? { ...EMPTY_PROMO, ...promo } : EMPTY_PROMO);
  }, [promo]);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const is2x1 = String(form.tipoDescuento || '').toUpperCase() === '2X1';

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
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
          <button
            className="btn fw-bold px-4 d-flex align-items-center gap-2"
            style={{ background: '#e67e22', color: 'white', borderRadius: '0.75rem' }}
            onClick={() => onSave(form)}
            disabled={saving
              || !form.titulo?.trim()
              || (is2x1
                ? (!form.codigoPromo?.trim() || !form.categoriaId)
                : (!form.valorDescuento || Number(form.valorDescuento) <= 0))}
          >
            {saving
              ? <><LoadingSpinner size="sm" className="me-2" variant="light" />Guardando...</>
              : isNew ? <><Plus size={18} /> Crear</> : <><Save size={18} /> Guardar</>}
          </button>
        </div>
      )}
    >
      <FormInput
        id="promo-titulo"
        label="Título"
        required
        value={form.titulo}
        onChange={(e) => set('titulo', e.target.value)}
        placeholder="Ej. Promo del día"
      />

      <FormInput
        id="promo-descripcion"
        as="textarea"
        rows={2}
        label="Descripción"
        value={form.descripcion}
        onChange={(e) => set('descripcion', e.target.value)}
        placeholder="Detalles visibles para el cliente..."
      />

      <div className="row g-3 mb-3">
        <div className="col-6">
          <FormInput
            id="promo-tipo"
            as="select"
            label="Tipo de descuento"
            value={form.tipoDescuento}
            onChange={(e) => {
              const next = e.target.value;
              set('tipoDescuento', next);
              if (String(next).toUpperCase() === '2X1') set('valorDescuento', 0);
            }}
            options={[
              { value: 'PORCENTAJE', label: '% Porcentaje' },
              { value: 'MONTO_FIJO', label: '$ Monto fijo' },
              { value: '2X1', label: '2x1 (por categoría)' },
            ]}
          />
        </div>
        <div className="col-6">
          <FormInput
            id="promo-valor"
            type="number"
            label={`Valor ${form.tipoDescuento === 'PORCENTAJE' ? '(%)' : '($)'}`}
            required
            value={form.valorDescuento}
            disabled={is2x1}
            onKeyDown={(e) => {
              if (['+', '-', 'e', 'E'].includes(e.key)) e.preventDefault();
            }}
            onChange={(e) => set('valorDescuento', e.target.value)}
            placeholder="Ej. 10"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <FormInput
        id="promo-categoria"
        as="select"
        label={is2x1 ? 'Categoría (obligatoria para 2x1)' : 'Categoría (opcional)'}
        value={form.categoriaId ?? ''}
        onChange={(e) => set('categoriaId', e.target.value)}
        options={[
          { value: '', label: '— Sin categoría —' },
          ...(categorias || []).map((c) => ({ value: String(c.id), label: c.nombre })),
        ]}
        helperText={is2x1
          ? 'La promo 2x1 solo aplica a platillos de esta categoría.'
          : 'Si eliges una categoría, la promo solo afectará platillos de esa categoría.'}
      />

      <FormInput
        id="promo-codigo"
        label={is2x1 ? 'Código (obligatorio para 2x1)' : 'Código (opcional)'}
        value={form.codigoPromo}
        onKeyDown={(e) => {
          if (['+', '-'].includes(e.key)) e.preventDefault();
        }}
        onChange={(e) => set('codigoPromo', e.target.value.toUpperCase())}
        placeholder="Ej. PROMO10"
        style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
        helperText={is2x1
          ? 'Para 2x1 se requiere un código; al aplicarlo se calcula el descuento según los platillos de la categoría.'
          : 'Si no tiene código, la promo es informativa (el mesero la aplica manualmente).'}
      />

      <div className="row g-3 mb-3">
        <div className="col-6">
          <FormInput
            id="promo-fecha-inicio"
            type="date"
            label="Fecha inicio"
            value={form.fechaInicio || ''}
            onChange={(e) => set('fechaInicio', e.target.value)}
          />
        </div>
        <div className="col-6">
          <FormInput
            id="promo-fecha-fin"
            type="date"
            label="Fecha fin"
            value={form.fechaFin || ''}
            onChange={(e) => set('fechaFin', e.target.value)}
          />
        </div>
      </div>

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

