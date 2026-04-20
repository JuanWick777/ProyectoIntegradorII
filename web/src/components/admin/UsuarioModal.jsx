import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeRole = (value) => (value || '').toString().trim().toLowerCase();

const validate = (form, isNew) => {
    const errs = {};

    if (!form.nombre?.trim()) errs.nombre = 'El nombre es obligatorio.';
    else if (form.nombre.trim().length < 2) errs.nombre = 'El nombre debe tener al menos 2 caracteres.';
    else if (form.nombre.trim().length > 200) errs.nombre = 'El nombre no puede exceder 200 caracteres.';

    if (isNew) {
        if (!form.email?.trim()) errs.email = 'El correo es obligatorio.';
        else if (!EMAIL_REGEX.test(form.email.trim())) errs.email = 'Formato de correo invalido.';
        else if (form.email.trim().length > 150) errs.email = 'El correo no puede exceder 150 caracteres.';
    } else if (form.email?.trim() && !EMAIL_REGEX.test(form.email.trim())) {
        errs.email = 'Formato de correo invalido.';
    } else if (form.email?.trim() && form.email.trim().length > 150) {
        errs.email = 'El correo no puede exceder 150 caracteres.';
    }

    if (isNew) {
        if (!form.password) errs.password = 'La contrasena es obligatoria para nuevos empleados.';
        else if (form.password.length < 6) errs.password = 'La contrasena debe tener al menos 6 caracteres.';
        else if (form.password.length > 255) errs.password = 'La contrasena no puede exceder 255 caracteres.';
    } else if (form.password && form.password.length < 6) {
        errs.password = 'La contrasena debe tener al menos 6 caracteres.';
    } else if (form.password && form.password.length > 255) {
        errs.password = 'La contrasena no puede exceder 255 caracteres.';
    }

    if (!form.rol) errs.rol = 'Selecciona un rol.';

    if (normalizeRole(form.rol) === 'mesero') {
        const mesaIds = Array.isArray(form.mesaIds) ? form.mesaIds.filter(Boolean) : [];
        if (mesaIds.length === 0) errs.mesaIds = 'Asigna al menos una mesa al mesero.';
        else if (mesaIds.length > 3) errs.mesaIds = 'Solo puedes asignar entre 1 y 3 mesas.';
    }

    return errs;
};

const UsuarioModal = ({ usuario, mesas = [], mesasOcupadasMap = new Map(), onSave, onClose, saving }) => {
    const isNew = !usuario?.id;
    const usuarioIdActual = usuario?.id ?? null;

    const initialMesaIds = useMemo(() => {
        if (!usuario) return [];
        if (Array.isArray(usuario.mesaIds)) return usuario.mesaIds;
        return [];
    }, [usuario]);

    const [form, setForm] = useState(
        usuario
            ? {
                ...usuario,
                password: '',
                mesaIds: initialMesaIds,
            }
            : {
                nombre: '',
                email: '',
                password: '',
                rol: 'mesero',
                mesaIds: [],
            }
    );

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const set = (k, v) => {
        setForm((prev) => ({ ...prev, [k]: v }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errs = validate(form, isNew);
        setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };

    const handleMesaToggle = (mesaId) => {
        const current = Array.isArray(form.mesaIds) ? form.mesaIds : [];
        const next = current.includes(mesaId)
            ? current.filter((id) => id !== mesaId)
            : [...current, mesaId];

        set('mesaIds', next);
        setTouched((prev) => ({ ...prev, mesaIds: true }));
        const errs = validate({ ...form, mesaIds: next }, isNew);
        setErrors((prev) => ({ ...prev, mesaIds: errs.mesaIds }));
    };

    const handleSubmit = () => {
        if (saving) return;
        setTouched({
            nombre: true,
            email: true,
            password: true,
            rol: true,
            mesaIds: true,
        });
        const errs = validate(form, isNew);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave({
            ...form,
            nombre: form.nombre.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
        });
    };

    const rolFormRaw = normalizeRole(form.rol) || 'mesero';
    const rolForm = rolFormRaw === 'cocinero' ? 'chef' : rolFormRaw;
    const esMesero = rolForm === 'mesero';
    const mesasSeleccionadas = Array.isArray(form.mesaIds) ? form.mesaIds : [];

    const fieldClass = (field) =>
        `form-control ${touched[field] && errors[field] ? 'is-invalid' : touched[field] && !errors[field] ? 'is-valid' : ''}`;

    const selectClass = (field) =>
        `form-select ${touched[field] && errors[field] ? 'is-invalid' : ''}`;

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem', minHeight: 640 }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? 'Nuevo Empleado' : 'Editar Empleado'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={saving} />
                    </div>

                    <div className="modal-body pt-2 d-flex flex-column" style={{ minHeight: 500 }}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Nombre completo <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('nombre')}
                                value={form.nombre}
                                onChange={(e) => {
                                    const val = e.target.value.slice(0, 200);
                                    if (/[^A-Za-zÀ-ÿ\s.'-]/.test(val.slice(-1))) return;
                                    set('nombre', val);
                                }}
                                onBlur={() => handleBlur('nombre')}
                                placeholder="Ej. Juan Perez"
                                disabled={saving}
                            />
                            {touched.nombre && errors.nombre && (
                                <div className="invalid-feedback d-flex align-items-center gap-1">
                                    <span>!</span> {errors.nombre}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Correo electronico <span className="text-danger">*</span>
                            </label>
                            <input
                                className={fieldClass('email')}
                                type="email"
                                value={form.email}
                                maxLength={150}
                                onChange={(e) => set('email', e.target.value.slice(0, 150))}
                                onBlur={() => handleBlur('email')}
                                placeholder="empleado@rest.com"
                                disabled={saving}
                            />
                            {touched.email && errors.email && (
                                <div className="invalid-feedback d-flex align-items-center gap-1">
                                    <span>!</span> {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Contrasena{' '}
                                {isNew
                                    ? <span className="text-danger">*</span>
                                    : <span className="text-muted">(dejar vacio para no cambiar)</span>}
                            </label>
                            <div className="input-group">
                                <input
                                    className={fieldClass('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ borderRight: 0 }}
                                    value={form.password}
                                    maxLength={255}
                                    onChange={(e) => set('password', e.target.value.slice(0, 255))}
                                    onBlur={() => handleBlur('password')}
                                    placeholder={isNew ? 'Minimo 6 caracteres' : '******'}
                                    disabled={saving}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    style={{ borderLeft: 0 }}
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                                    disabled={saving}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <div className="invalid-feedback d-flex align-items-center gap-1" style={{ display: 'flex' }}>
                                    <span>!</span> {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold small">
                                    Rol <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={selectClass('rol')}
                                    value={rolForm}
                                    onChange={(e) => {
                                        const nextRole = e.target.value;
                                        set('rol', nextRole);
                                        if (nextRole !== 'mesero') {
                                            set('mesaIds', []);
                                        }
                                        setTouched((p) => ({ ...p, rol: true }));
                                    }}
                                    disabled={saving}
                                >
                                    <option value="mesero">Mesero</option>
                                    <option value="chef">Chef</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                {touched.rol && errors.rol && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <span>!</span> {errors.rol}
                                    </div>
                                )}
                            </div>
                        </div>

                        {esMesero && (
                            <div className="mb-3 flex-grow-1">
                                <label className="form-label fw-semibold small">
                                    Mesas asignadas <span className="text-danger">*</span>
                                </label>
                                <div className="border rounded-3 p-3" style={{ minHeight: 220, maxHeight: 260, overflowY: 'auto' }}>
                                    {mesas.length > 0 ? mesas.map((mesa) => {
                                        const checked = mesasSeleccionadas.includes(mesa.id);
                                        const ocupada = mesasOcupadasMap.get(mesa.id);
                                        const ocupadaPorOtro = Boolean(ocupada && ocupada.usuarioId !== usuarioIdActual);
                                        const limiteExcedido = !checked && mesasSeleccionadas.length >= 3;
                                        const disabled = ocupadaPorOtro || limiteExcedido;

                                        return (
                                            <div key={mesa.id} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`mesa-${mesa.id}`}
                                                    checked={checked}
                                                    disabled={disabled || saving}
                                                    onChange={() => handleMesaToggle(mesa.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`mesa-${mesa.id}`}>
                                                    <span className="fw-semibold">Mesa {mesa.numero}</span>
                                                    {ocupadaPorOtro && (
                                                        <span className="ms-2 text-muted small">
                                                            (Asignada a {ocupada.nombre})
                                                        </span>
                                                    )}
                                                    {!ocupadaPorOtro && checked && (
                                                        <span className="ms-2 text-success small">(Asignada a este mesero)</span>
                                                    )}
                                                </label>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-muted small">No hay mesas disponibles.</div>
                                    )}
                                </div>
                                <div className="form-text">
                                    Selecciona entre 1 y 3 mesas para este mesero. Las mesas ocupadas por otros meseros se muestran bloqueadas.
                                </div>
                                {touched.mesaIds && errors.mesaIds && (
                                    <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                                        <span>!</span> {errors.mesaIds}
                                    </div>
                                )}
                            </div>
                        )}

                        {!esMesero && <div className="flex-grow-1" />}
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
                            ) : isNew ? 'Crear' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsuarioModal;
