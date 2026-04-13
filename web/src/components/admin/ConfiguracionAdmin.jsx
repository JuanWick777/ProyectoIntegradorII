import React, { useState } from 'react';
import { Settings, CheckCircle2, Moon, SunMedium } from 'lucide-react';

const ConfiguracionAdmin = () => {
    const [fontSize, setFontSize] = useState('Mediana');
    const [theme, setTheme] = useState('Claro');
    const [compactView, setCompactView] = useState(false);

    return (
        <div className="bg-white rounded-4 shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <p className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>Configuración</p>
                    <h2 className="fw-bold mb-1">Preferencias de la Aplicación</h2>
                    <p className="text-muted mb-0">Personaliza tu experiencia en el sistema</p>
                </div>
                <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: 62, height: 62, background: '#fff4e6' }}>
                    <Settings size={28} className="text-warning" />
                </div>
            </div>

            <div className="p-4 rounded-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                <h4 className="fw-semibold mb-3">Apariencia</h4>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Tamaño de Fuente</label>
                    <select
                        className="form-select"
                        value={fontSize}
                        onChange={e => setFontSize(e.target.value)}
                        style={{ borderRadius: '1rem' }}
                    >
                        <option value="Pequeña">Pequeña</option>
                        <option value="Mediana">Mediana</option>
                        <option value="Grande">Grande</option>
                    </select>
                    <div className="form-text">Ajusta el tamaño del texto en toda la aplicación.</div>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Tema de Color</label>
                    <select
                        className="form-select"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        style={{ borderRadius: '1rem' }}
                    >
                        <option value="Claro">Claro</option>
                        <option value="Oscuro">Oscuro</option>
                        <option value="Colorido">Colorido</option>
                    </select>
                    <div className="form-text">Selecciona el tema de color de la interfaz.</div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 rounded-4" style={{ background: '#ffffff', border: '1px solid #dee2e6' }}>
                    <div>
                        <div className="fw-semibold">Vista Compacta</div>
                        <div className="text-muted small">Reduce el espaciado entre elementos.</div>
                    </div>
                    <button
                        type="button"
                        className={`btn ${compactView ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: '2rem', minWidth: 120 }}
                        onClick={() => setCompactView(!compactView)}
                    >
                        {compactView ? (
                            <><CheckCircle2 size={16} className="me-2" />Activado</>
                        ) : (
                            <><SunMedium size={16} className="me-2" />Desactivado</>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 text-muted small">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <SunMedium size={16} />
                    <span>Fuente: {fontSize}</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <Moon size={16} />
                    <span>Tema: {theme}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Vista compacta: {compactView ? 'Activada' : 'Desactivada'}</span>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracionAdmin;
