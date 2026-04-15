import React, { useState } from 'react';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import { PrimaryButton, SecondaryButton } from '../ui/Button';
import { Plus, Edit, Save } from 'lucide-react';

const UsuarioModal = ({ usuario, mesas = [], onSave, onClose, saving }) => {
    const isNew = !usuario?.id;

    const normalizeUsuarioForm = (user) => ({
        nombre: user?.nombre ?? '',
        email: user?.email ?? user?.correo ?? '',
        password: '',
        rol: (user?.rol ?? 'mesero').toLowerCase(),
        mesaIds: user?.mesaIds ?? [],
    });

    const [form, setForm] = useState(normalizeUsuarioForm(usuario));

    React.useEffect(() => {
        setForm(normalizeUsuarioForm(usuario));
    }, [usuario]);

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
    const rolForm = form.rol?.toLowerCase() || 'mesero';
    const esMesero = rolForm === 'mesero';

    const toggleMesa = (mesaId) => {
        setForm((prev) => {
            const actual = prev.mesaIds || [];
            const existe = actual.includes(mesaId);
            const next = existe
                ? actual.filter((id) => id !== mesaId)
                : [...actual, mesaId];

            return {
                ...prev,
                mesaIds: next,
            };
        });
    };

    return (
        <Modal
            title={isNew ? <><Plus size={18} className="me-2" />Nuevo Empleado</> : <><Edit size={18} className="me-2" />Editar Empleado</>}
            onClose={onClose}
            className="border-0"
            bodyClassName=""
            size="md"
            footerClassName="d-flex gap-3 justify-content-end"
            footer={(
                <>
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
                        onClick={() => onSave(form)}
                        disabled={
                            saving ||
                            !form.nombre?.trim() ||
                            !form.email?.trim() ||
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
                            (isNew && (!form.password || form.password.length < 6)) ||
                            (esMesero && ((form.mesaIds || []).length < 1 || (form.mesaIds || []).length > 3))
                        }
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Guardando...
                            </>
                        ) : isNew ? <><Plus size={16} className="me-2" />Crear</> : <><Save size={16} className="me-2" />Guardar</>}
                    </PrimaryButton>
                </>
            )}
        >
            <FormInput
                id="nombre"
                label="Nombre completo *"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej. Juan Perez"
            />

            <FormInput
                id="email"
                label="Correo electronico *"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="empleado@rest.com"
            />

            <FormInput
                id="password"
                label={
                    <>
                        Contrasena {!isNew && <span className="text-muted">(dejar vacio para no cambiar)</span>}
                    </>
                }
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={isNew ? 'Minimo 6 caracteres' : '******'}
            />

            <FormInput
                id="rol"
                label="Rol *"
                as="select"
                value={rolForm}
                onChange={(e) => setForm((prev) => ({
                    ...prev,
                    rol: e.target.value,
                    mesaIds: e.target.value === 'mesero' ? prev.mesaIds : [],
                }))}
                options={[
                    { value: 'mesero', label: 'Mesero' },
                    { value: 'cocinero', label: 'Cocinero' },
                    { value: 'chef', label: 'Chef' },
                    { value: 'admin', label: 'Administrador' },
                ]}
            />

            {esMesero && (
                <div className="mb-3">
                    <div className="form-label fw-semibold small text-secondary">
                        Mesas asignadas * <span className="text-muted">(elige de 1 a 3)</span>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        {mesas.map((mesa) => {
                            const checked = (form.mesaIds || []).includes(mesa.id);
                            return (
                                <button
                                    key={mesa.id}
                                    type="button"
                                    className={`btn btn-sm fw-semibold ${checked ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    style={{ borderRadius: '999px' }}
                                    onClick={() => toggleMesa(mesa.id)}
                                    disabled={!checked && (form.mesaIds || []).length >= 3}
                                >
                                    Mesa {mesa.numero}
                                </button>
                            );
                        })}
                    </div>
                    {mesas.length === 0 && (
                        <div className="text-muted small mt-2">No hay mesas registradas.</div>
                    )}
                    {((form.mesaIds || []).length < 1 || (form.mesaIds || []).length > 3) && (
                        <div className="text-danger small mt-2">Un mesero debe tener entre 1 y 3 mesas.</div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default UsuarioModal;
