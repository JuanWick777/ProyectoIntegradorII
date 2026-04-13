import React, { useState } from 'react';
import { MESAS_OPCIONES } from './adminConstants';
import Modal from '../ui/Modal';
import FormInput from '../ui/FormInput';
import { Plus, Edit, Save, UserCheck, ChefHat, Shield, Flame, Coffee, Cake, User } from 'lucide-react';

const UsuarioModal = ({ usuario, onSave, onClose, saving }) => {
    const isNew = !usuario?.id;

    const normalizeUsuarioForm = (user) => ({
        nombre: user?.nombre ?? '',
        email: user?.email ?? user?.correo ?? '',
        password: '',
        rol: user?.rol ?? 'mesero',
        especialidad: user?.especialidad ?? '',
        mesaId: user?.mesaId ?? user?.mesa_id ?? null,
    });

    const [form, setForm] = useState(normalizeUsuarioForm(usuario));

    React.useEffect(() => {
        setForm(normalizeUsuarioForm(usuario));
    }, [usuario]);

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const rolForm = form.rol?.toLowerCase() || 'mesero';
    const esCocinero = rolForm === 'cocinero' || rolForm === 'chef';
    const esMesero = rolForm === 'mesero';

    return (
        <Modal
            title={isNew ? <><Plus size={18} className="me-2" />Nuevo Empleado</> : <><Edit size={18} className="me-2" />Editar Empleado</>}
            onClose={onClose}
            className="border-0"
            bodyClassName="pt-2"
            footerClassName="justify-end gap-2"
            footer={(
                <>
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
                        ) : isNew ? <><Plus size={16} className="me-2" />Crear</> : <><Save size={16} className="me-2" />Guardar</>}
                    </button>
                </>
            )}
        >
            <FormInput
                id="nombre"
                label="Nombre completo *"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej. Juan Pérez"
            />

            <FormInput
                id="email"
                label="Correo electrónico *"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="empleado@rest.com"
            />

            <FormInput
                id="password"
                label={
                    <>
                        Contraseña {!isNew && <span className="text-muted">(dejar vacío para no cambiar)</span>}
                    </>
                }
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder={isNew ? 'Mínimo 6 caracteres' : '••••••'}
            />

            <div className="row g-3 mb-3">
                <div className="col-6">
                    <FormInput
                        id="rol"
                        label="Rol *"
                        as="select"
                        value={rolForm}
                        onChange={(e) => set('rol', e.target.value)}
                        options={[
                            { value: 'mesero', label: 'Mesero' },
                            { value: 'cocinero', label: 'Cocinero' },
                            { value: 'chef', label: 'Chef' },
                            { value: 'admin', label: 'Administrador' },
                        ]}
                    />
                </div>

                {esCocinero && (
                    <div className="col-6">
                        <FormInput
                            id="especialidad"
                            label="Especialidad"
                            as="select"
                            value={form.especialidad}
                            onChange={(e) => set('especialidad', e.target.value)}
                            options={[
                                { value: '', label: '— Sin especialidad —' },
                                { value: 'parrillero', label: 'Parrillero' },
                                { value: 'barista', label: 'Barista' },
                                { value: 'repostero', label: 'Repostero' },
                            ]}
                        />
                    </div>
                )}
            </div>

            {esMesero && (
                <FormInput
                    id="mesaId"
                    label="Mesa asignada"
                    as="select"
                    value={form.mesaId || ''}
                    onChange={(e) => set('mesaId', e.target.value ? Number(e.target.value) : null)}
                    options={[
                        { value: '', label: '— Sin mesa —' },
                        ...MESAS_OPCIONES.map((m) => ({ value: m.id, label: m.nombre })),
                    ]}
                />
            )}
        </Modal>
    );
};

export default UsuarioModal;
