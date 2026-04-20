import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AvisoPrivacidadModal = ({ abierto, onClose }) => {
    if (!abierto) return null;

    return (
        <div
            className="modal d-flex align-items-center justify-content-center"
            style={{
                display: 'flex',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'rgba(15, 23, 42, 0.45)',
                zIndex: 9999,
                padding: '1rem',
            }}
        >
            <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 720, borderRadius: '1.25rem' }}>
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-start gap-3 mb-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{ width: 48, height: 48, background: '#fff7ed', color: '#f97316', flexShrink: 0 }}
                        >
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h4 className="fw-bold mb-1" style={{ color: '#111827' }}>
                                Aviso de privacidad
                            </h4>
                            <p className="text-muted mb-0 small">
                                Tratamiento de datos personales para el sistema de pedidos y lealtad.
                            </p>
                        </div>
                    </div>

                    <div className="small" style={{ color: '#374151', lineHeight: 1.65 }}>
                        <p>
                            Este sistema recopila datos personales como nombre, correo electronico, credenciales de acceso,
                            historial de pedidos, puntos de lealtad y, cuando aplique, fotografia de perfil.
                        </p>
                        <p>
                            Los datos se utilizan para crear y administrar cuentas, autenticar usuarios, recuperar contrasenas,
                            procesar pedidos, gestionar mesas, operar el programa de lealtad y mantener medidas de seguridad del sistema.
                        </p>
                        <p>
                            No deben usarse para finalidades distintas a la operacion del restaurante sin consentimiento adicional.
                            El acceso a la informacion se limita segun el rol de cada usuario.
                        </p>
                        <p>
                            La persona titular puede solicitar acceso, rectificacion, cancelacion u oposicion al tratamiento de sus datos
                            personales mediante los canales oficiales definidos por el restaurante o la administracion del sistema.
                        </p>
                        <p className="mb-0">
                            Este aviso puede actualizarse cuando cambien los procesos, finalidades o mecanismos de atencion relacionados
                            con datos personales.
                        </p>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="button"
                            className="btn fw-semibold px-4"
                            onClick={onClose}
                            style={{
                                borderRadius: '0.75rem',
                                background: '#f97316',
                                borderColor: '#f97316',
                                color: '#ffffff',
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvisoPrivacidadModal;
