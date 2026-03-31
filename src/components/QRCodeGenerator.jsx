import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Using SVG for better print quality

const QRGenerator = () => {
    const [baseUrl, setBaseUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('qr_base_url');
            if (saved) return saved;

            const url = new URL(window.location.href);
            return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
        }
        return '';
    });

    const [totalMesas, setTotalMesas] = useState(() => {
        const saved = localStorage.getItem('qr_total_mesas');
        return saved ? Number(saved) : 10;
    });

    useEffect(() => {
        if (baseUrl) localStorage.setItem('qr_base_url', baseUrl);
    }, [baseUrl]);

    useEffect(() => {
        localStorage.setItem('qr_total_mesas', totalMesas);
    }, [totalMesas]);

    const [generando, setGenerando] = useState(false);
    const [genMsg, setGenMsg] = useState('');

    const tables = Array.from({ length: Math.max(0, totalMesas) }, (_, i) => i + 1);

    const printPage = () => window.print();

    const resetUrl = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            setBaseUrl(`${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`);
        }
    };

    const generarMesas = async () => {
        setGenerando(true);
        setGenMsg('');
        try {
            const API = `http://${window.location.hostname}:8080`;
            const res = await fetch(`${API}/api/admin/mesas/generar?hasta=${totalMesas}`, {
                method: 'POST', credentials: 'include'
            });
            const data = await res.json();
            setGenMsg(data.mensaje || 'Listo');
        } catch {
            setGenMsg('Error al generar — verifica que el servidor esté corriendo');
        } finally {
            setGenerando(false);
            setTimeout(() => setGenMsg(''), 5000);
        }
    };

    return (
        <div className="container py-5 print-container">
            <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom d-print-none">
                <div>
                    <h2 className="fw-bold mb-1">Generador de Códigos QR</h2>
                    <p className="text-muted small mb-0">Imprime esta hoja para colocarla en las mesas y estaciones de trabajo.</p>
                </div>
                <div className="d-flex gap-3 align-items-center flex-wrap justify-content-end">
                    {/* Input: número de mesas */}
                    <div className="input-group input-group-sm" style={{ width: '180px' }}>
                        <span className="input-group-text bg-light">🪑 Mesas (1 a)</span>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={totalMesas}
                            onChange={e => setTotalMesas(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                            className="form-control text-center fw-bold"
                        />
                    </div>
                    {/* Input: URL base */}
                    <div className="input-group input-group-sm" style={{ width: '300px' }}>
                        <span className="input-group-text bg-light">URL Base</span>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={e => setBaseUrl(e.target.value)}
                            className="form-control"
                            placeholder="http://192.168.1.50:5173"
                        />
                        <button onClick={resetUrl} className="btn btn-outline-secondary">Reset</button>
                    </div>
                    {/* Botón generar mesas */}
                    <button
                        onClick={generarMesas}
                        disabled={generando}
                        className="btn btn-success fw-semibold shadow-sm"
                    >
                        {generando ? '⏳ Generando...' : '🏗️ Generar Mesas en BD'}
                    </button>
                    <button onClick={printPage} className="btn btn-primary fw-semibold shadow-sm">
                        🖨️ Imprimir QRs
                    </button>
                </div>
            </header>
            {genMsg && (
                <div className="alert alert-success alert-dismissible d-print-none mb-3" role="alert">
                    ✅ {genMsg}
                    <button type="button" className="btn-close" onClick={() => setGenMsg('')} />
                </div>
            )}

            <div className="row g-4 print-row">
                {/* QR COCINA */}
                <div className="col-sm-6 col-md-4 col-lg-3 page-break-avoid">
                    <div className="card h-100 shadow-sm border-0" style={{ borderTop: '4px solid #0d6efd', backgroundColor: '#f8fbfc' }}>
                        <div className="card-body d-flex flex-column align-items-center text-center">
                            <h5 className="card-title fw-bold text-uppercase text-primary mb-3">KDS Cocina</h5>
                            <QRCodeSVG
                                value={`${baseUrl}/?cocina=true`}
                                size={150}
                                level="H"
                                includeMargin={true}
                                fgColor="#0d6efd"
                            />
                            <div className="mt-3">
                                <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">👨‍🍳 Staff Backend</span>
                            </div>
                            <small className="text-muted mt-3 font-monospace" style={{ fontSize: '0.65rem' }}>{`${baseUrl}/?cocina=true`}</small>
                        </div>
                    </div>
                </div>

                {/* QR MESERO */}
                <div className="col-sm-6 col-md-4 col-lg-3 page-break-avoid">
                    <div className="card h-100 shadow-sm border-0" style={{ borderTop: '4px solid #198754', backgroundColor: '#f8fdf9' }}>
                        <div className="card-body d-flex flex-column align-items-center text-center">
                            <h5 className="card-title fw-bold text-uppercase text-success mb-3">Panel Mesero</h5>
                            <QRCodeSVG
                                value={`${baseUrl}/?mesero=true`}
                                size={150}
                                level="H"
                                includeMargin={true}
                                fgColor="#198754"
                            />
                            <div className="mt-3">
                                <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">📋 Empleado</span>
                            </div>
                            <small className="text-muted mt-3 font-monospace" style={{ fontSize: '0.65rem' }}>{`${baseUrl}/?mesero=true`}</small>
                        </div>
                    </div>
                </div>

                {/* QR MESA 1-10 */}
                {tables.map(num => (
                    <div key={num} className="col-sm-6 col-md-4 col-lg-3 page-break-avoid">
                        <div className="card h-100 shadow-sm border-0" style={{ borderTop: '4px solid #fd7e14' }}>
                            <div className="card-body d-flex flex-column align-items-center text-center">
                                <h5 className="card-title fw-bold text-uppercase text-secondary mb-3">Mesa {num}</h5>
                                <QRCodeSVG
                                    value={`${baseUrl}/?mesa=${num}`}
                                    size={150}
                                    level="H"
                                    includeMargin={true}
                                    fgColor="#212529"
                                />
                                <div className="mt-3">
                                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">🍊 Comensal</span>
                                </div>
                                <small className="text-muted mt-3 font-monospace" style={{ fontSize: '0.65rem' }}>{`${baseUrl}/?mesa=${num}`}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estilos específicos para impresión */}
            <style jsx="true">{`
                @media print {
                    .d-print-none { display: none !important; }
                    .page-break-avoid { break-inside: avoid; page-break-inside: avoid; margin-bottom: 20px; }
                    .print-container { padding: 0 !important; max-width: 100% !important; background: white !important; }
                    .shadow-sm { box-shadow: none !important; border: 1px solid #dee2e6 !important; }
                }
            `}</style>
        </div>
    );
};

export default QRGenerator;
