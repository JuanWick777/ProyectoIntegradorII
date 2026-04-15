import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { MESAS_OPCIONES } from './adminConstants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form, isNew) => {
    const errs = {};

    // Nombre siempre obligatorio
    if (!form.nombre?.trim()) errs.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length < 2) errs.nombre = 'El nombre debe tener al menos 2 caracteres.';

    // Email: obligatorio si es nuevo, o si escribió algo al editar
    if (isNew) {
        if (!form.email?.trim()) errs.email = 'El correo es obligatorio.';
        else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Formato de correo inválido (ej. empleado@rest.com).';
    } else if (form.email?.trim() && !EMAIL_REGEX.test(form.email.trim())) {
        errs.email = 'Formato de correo inválido (ej. empleado@rest.com).';
    }

    // Contraseña: obligatoria si es nuevo, o si escribió algo al editar
    if (isNew) {
        if (!form.password) errs.password = 'La contraseña es obligatoria para nuevos empleados.';
        else if (form.password.length < 6) errs.password = 'La contraseña debe tener al menos 6 caracteres.';
    } else if (form.password && form.password.length < 6) {
        errs.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Rol siempre obligatorio
    if (!form.rol) errs.rol = 'Selecciona un rol.';
    return errs;
};

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

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const set = (k, v) => {
        setForm((prev) => ({ ...prev, [k]: v }));
        // Limpiar error del campo al escribir
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validate(form, isNew);
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };

    const handleSubmit = () => {
        // Marcar todo como tocado
        setTouched({ nombre: true, email: true, password: true, rol: true });
        const errs = validate(form, isNew);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave(form);
    };

    const rolForm = form.rol?.toLowerCase() || 'mesero';
    const esCocinero = rolForm === 'cocinero' || rolForm === 'chef';
    const esMesero = rolForm === 'mesero';

    const fieldClass = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] ? 'is-valid' : ''}`;

    const selectClass = (field) =>
        `form-select ${touched[field] && errors[field] ? 'is-invalid' : ''}`;

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
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Nombre completo <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('nombre')}
                                value={form.nombre}
                                onChange={(e) => {
                                    // Bloquear caracteres numéricos y especiales que no son letras
                                    const val = e.target.value;
                                    if (/[0-9@#$%^&*()_+=[\]{};:'",<>?/\\|`~]/.test(val.slice(-1))) return;
                                    set('nombre', val);
                                }}
                                onBlur={() => handleBlur('nombre')}
                                placeholder="Ej. Juan Pérez"
                            />
                            {touched.nombre && errors.nombre && (
                                <div className="invalid-feedback d-flex align-items-center gap-1">
                                    <span>⚠</span> {errors.nombre}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Correo electrónico <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('email')}
                                type="email"
                                value={form.email}
                                onChange={(e) => set('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                placeholder="empleado@rest.com"
                            />
                            {touched.email && errors.email && (
                                <div className="invalid-feedback d-flex align-items-center gap-1">
                                    <span>⚠</span> {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Contraseña{' '}
                                {isNew
                                    ? <span className="text-danger">*</span>
                                    : <span className="text-muted">(dejar vacío para no cambiar)</span>}
                            </label>
                            <div className="input-group">
                                <input
                                    className={fieldClass('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ borderRight: 0 }}
                                    value={form.password}
                                    onChange={(e) => set('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder={isNew ? 'Mínimo 6 caracteres' : '••••••'}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    style={{ borderLeft: 0 }}
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <div className="invalid-feedback d-flex align-items-center gap-1" style={{ display: 'flex !important' }}>
                                    <span>⚠</span> {errors.password}
                                </div>
                            )}
                            {form.password && !errors.password && (
                                <div className="form-text text-muted">
                                    Seguridad: {form.password.length >= 8 ? '🟢 Buena' : '🟡 Mínima'}
                                </div>
                            )}
                        </div>

                        {/* Rol y Especialidad */}
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">
                                    Rol <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={selectClass('rol')}
                                    value={rolForm}
                                    onChange={(e) => {
                                        set('rol', e.target.value);
                                        setTouched((p) => ({ ...p, rol: true }));
                                    }}
                                >
                                    <option value="mesero">🧑‍🍽️ Mesero</option>
                                    <option value="cocinero">👨‍🍳 Cocinero</option>
                                    <option value="chef">👨‍🍳 Chef</option>
                                    <option value="admin">🛡️ Administrador</option>
                                </select>
                                {touched.rol && errors.rol && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <span>⚠</span> {errors.rol}
                                    </div>
                                )}
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

                        {/* Mesa (solo mesero) */}
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
                            onClick={handleSubmit}
                            disabled={saving}
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
