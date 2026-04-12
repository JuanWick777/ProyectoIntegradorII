import React, { useState } from 'react';
import { MESAS_OPCIONES } from './adminConstants';

const UsuarioModal = ({ usuario, onSave, onClose, saving }) => {
    const isNew = !usuario?.id;

    const [form, setForm] = useState(
        usuario || {
            nombre: '',
            email: '',
            password: '',
            rol: 'mesero',
            especialidad: '',
            mesaId: null,
        }
    );

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const rolForm = form.rol?.toLowerCase() || 'mesero';
    const esCocinero = rolForm === 'cocinero' || rolForm === 'chef';
    const esMesero = rolForm === 'mesero';

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? '➕ Nuevo Empleado' : '✏️ Editar Empleado'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body pt-2">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Nombre completo *</label>
                            <input
                                className="form-control"
                                value={form.nombre}
                                onChange={(e) => set('nombre', e.target.value)}
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Correo electrónico *</label>
                            <input
                                className="form-control"
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                                placeholder="empleado@rest.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Contraseña {!isNew && <span className="text-muted">(dejar vacío para no cambiar)</span>}
                            </label>
                            <input
                                className="form-control"
                                type="password"
                                value={form.password}
                                onChange={(e) => set('password', e.target.value)}
                                placeholder={isNew ? 'Mínimo 6 caracteres' : '••••••'}
                            />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Rol *</label>
                                <select
                                    className="form-select"
                                    value={rolForm}
                                    onChange={(e) => set('rol', e.target.value)}
                                >
                                    <option value="mesero">🧑‍🍽️ Mesero</option>
                                    <option value="cocinero">👨‍🍳 Cocinero</option>
                                    <option value="chef">👨‍🍳 Chef</option>
                                    <option value="admin">🛡️ Administrador</option>
                                </select>
                            </div>

                            {esCocinero && (
                                <div className="col-6">
                                    <label className="form-label fw-semibold small">Especialidad</label>
                                    <select
                                        className="form-select"
                                        value={form.especialidad}
                                        onChange={(e) => set('especialidad', e.target.value)}
                                    >
                                        <option value="">— Sin especialidad —</option>
                                        <option value="parrillero">🔥 Parrillero</option>
                                        <option value="barista">☕ Barista</option>
                                        <option value="repostero">🍰 Repostero</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {esMesero && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">🪑 Mesa asignada</label>
                                <select
                                    className="form-select"
                                    value={form.mesaId || ''}
                                    onChange={(e) => set('mesaId', e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">— Sin mesa —</option>
                                    {MESAS_OPCIONES.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer border-0 pt-0">
                        <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary fw-bold px-4"
                            style={{ borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={
                                saving ||
                                !form.nombre?.trim() ||
                                !form.email?.trim() ||
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
                                (isNew && (!form.password || form.password.length < 6))
                            }
                        >
                            {saving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Guardando...
                                </>
                            ) : isNew ? '➕ Crear' : '💾 Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsuarioModal;
