import React from 'react';
import { Gift, Pizza, Smartphone, Bell, Apple, Bot } from 'lucide-react';
import Modal from '../ui/Modal';
import { PrimaryButton, SecondaryButton } from '../ui/Button';

/**
 * FidelidadModal.jsx — Modal de fidelidad con diseño propio.
 *
 * Props:
 *   onContinue — callback cuando el usuario presiona "Continuar al Menú"
 */
const FidelidadModal = ({ onContinue }) => {
    const handleContinue = () => {
        onContinue();
    };

    const handleDownload = () => {
        // Acción futura: redirigir a tienda de apps
        alert('¡Próximamente disponible en App Store y Google Play!');
    };

    return (
        <Modal closeOnBackdrop={false} showCloseButton={false} className="overflow-hidden" bodyClassName="p-0">
            {/* Header con gradiente naranja */}
            <div
                className="text-white p-4 pb-5"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #E06900)' }}
            >
                <div className="text-center w-100">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)' }}
                    >
                        <span style={{ fontSize: 36 }}>⭐</span>
                    </div>
                    <h4 className="fw-bold mb-1">
                        ¡Acumula Puntos!
                    </h4>
                    <p className="mb-0 opacity-75 small">
                        Programa de fidelidad exclusivo para clientes
                    </p>
                </div>
            </div>

            {/* Body con contenido de beneficios */}
            <div className="px-4 pt-4 pb-3" style={{ marginTop: '-1.5rem' }}>
                <div
                    className="card border-0 shadow-sm mb-4"
                    style={{ borderRadius: '1rem', marginTop: '-2rem', position: 'relative', zIndex: 1 }}
                >
                    <div className="card-body p-3">
                        <h6 className="fw-bold text-dark mb-3">Con la App obtienes:</h6>
                        <ul className="list-unstyled mb-0">
                            {[
                                { Icon: Gift, text: '1 punto por cada $100 consumidos' },
                                { Icon: Pizza, text: 'Platillo gratis al acumular 300 pts' },
                                { Icon: Smartphone, text: 'Ordena desde tu celular' },
                                { Icon: Bell, text: 'Notificaciones de promociones' },
                            ].map((item, idx) => {
                                const IconComp = item.Icon;
                                return (
                                <li key={idx} className="d-flex align-items-center gap-2 py-1">
                                    <IconComp size={20} className="flex-shrink-0" style={{ color: '#e67e22' }} />
                                    <span className="text-secondary small">{item.text}</span>
                                </li>
                            );
                            })}
                        </ul>
                    </div>
                </div>

                <p className="text-center text-muted small mb-3">
                    Disponible próximamente en:
                </p>
                <div className="d-flex justify-content-center gap-3 mb-1">
                    <span className="badge bg-dark px-3 py-2 d-flex align-items-center gap-1">
                        <Apple size={16} /> App Store
                    </span>
                    <span className="badge bg-dark px-3 py-2 d-flex align-items-center gap-1">
                        <Bot size={16} /> Google Play
                    </span>
                </div>
            </div>

            <div className="px-4 pb-4 d-flex gap-3">
                <SecondaryButton
                    type="button"
                    fullWidth
                    className="py-2"
                    onClick={handleDownload}
                    style={{ borderRadius: '0.75rem' }}
                >
                    📲 Descargar App
                </SecondaryButton>
                <PrimaryButton
                    type="button"
                    fullWidth
                    className="py-2 fw-bold"
                    onClick={handleContinue}
                    style={{ borderRadius: '0.75rem' }}
                >
                    Continuar al Menú →
                </PrimaryButton>
            </div>
        </Modal>
    );
};

export default FidelidadModal;
