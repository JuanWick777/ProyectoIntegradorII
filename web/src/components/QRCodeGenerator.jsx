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

    // --- Nuevos estados Bloque 4: Impresión Selectiva ---
    const [printMode, setPrintMode] = useState('all'); // all, single, range
    const [singleMesaNum, setSingleMesaNum] = useState(1);
    const [rangeFrom, setRangeFrom] = useState(1);
    const [rangeTo, setRangeTo] = useState(5);
    const [includeStaff, setIncludeStaff] = useState(true);

    const tables = (() => {
        if (printMode === 'all') {
            return Array.from({ length: Math.max(0, totalMesas) }, (_, i) => i + 1);
        }
        if (printMode === 'single') {
            return [singleMesaNum];
        }
        if (printMode === 'range') {
            const start = Math.min(rangeFrom, rangeTo);
            const end = Math.max(rangeFrom, rangeTo);
            const length = Math.max(0, end - start + 1);
            return Array.from({ length }, (_, i) => start + i);
        }
        return [];
    })();

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
                method: 'POST'
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
            <header className="d-print-none mb-4 pb-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Generador de Códigos QR</h2>
                        <p className="text-muted small mb-0">Configura y elige qué mesas imprimir para ahorrar papel.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            onClick={generarMesas}
                            disabled={generando}
                            className="btn btn-outline-success btn-sm fw-bold shadow-sm"
                        >
                            {generando ? '⏳ Generando...' : '🏗️ Sincronizar Mesas en BD'}
                        </button>
                        <button onClick={printPage} className="btn btn-primary btn-sm fw-bold shadow-sm px-4">
                            🖨️ Imprimir Selección
                        </button>
                    </div>
                </div>

                <div className="bg-light p-3 rounded-4 shadow-sm border">
                    <div className="row g-3 align-items-center">
                        {/* URL BASE Y TOTAL */}
                        <div className="col-12 col-xl-4 d-flex gap-2">
                            <div className="input-group input-group-sm flex-grow-1">
                                <span className="input-group-text bg-white border-end-0">🔗 URL</span>
                                <input
                                    type="text"
                                    value={baseUrl}
                                    onChange={e => setBaseUrl(e.target.value)}
                                    className="form-control border-start-0"
                                    placeholder="http://..."
                                />
                            </div>
                            <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                <span className="input-group-text bg-white">📑 BD</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={totalMesas}
                                    onChange={e => setTotalMesas(Number(e.target.value))}
                                    className="form-control text-center fw-bold"
                                />
                            </div>
                        </div>

                        {/* MODO DE IMPRESIÓN */}
                        <div className="col-12 col-xl-5">
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <div className="btn-group btn-group-sm shadow-sm" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${printMode === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
                                        onClick={() => setPrintMode('all')}
                                    >
                                        Todas
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${printMode === 'single' ? 'btn-dark' : 'btn-outline-dark'}`}
                                        onClick={() => setPrintMode('single')}
                                    >
                                        Mesa Única
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${printMode === 'range' ? 'btn-dark' : 'btn-outline-dark'}`}
                                        onClick={() => setPrintMode('range')}
                                    >
                                        Rango
                                    </button>
                                </div>

                                {printMode === 'single' && (
                                    <div className="input-group input-group-sm" style={{ width: '130px' }}>
                                        <span className="input-group-text">#</span>
                                        <input
                                            type="number"
                                            className="form-control fw-bold"
                                            value={singleMesaNum}
                                            onChange={e => setSingleMesaNum(Number(e.target.value))}
                                        />
                                    </div>
                                )}

                                {printMode === 'range' && (
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center fw-bold"
                                            style={{ width: '70px' }}
                                            value={rangeFrom}
                                            onChange={e => setRangeFrom(Number(e.target.value))}
                                        />
                                        <span className="small fw-bold">al</span>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center fw-bold"
                                            style={{ width: '70px' }}
                                            value={rangeTo}
                                            onChange={e => setRangeTo(Number(e.target.value))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TOGGLE PERSONAL */}
                        <div className="col-12 col-xl-3 text-xl-end">
                            <div className="form-check form-switch d-inline-block">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="staffToggle"
                                    checked={includeStaff}
                                    onChange={e => setIncludeStaff(e.target.checked)}
                                />
                                <label className="form-check-label small fw-bold" htmlFor="staffToggle">
                                    Incluir Personal (Cocina/Mesero)
                                </label>
                            </div>
                        </div>
                    </div>
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
                {includeStaff && (
                    <div className="col-sm-6 col-md-4 col-lg-3 page-break-avoid">
                        <div className="card h-100 shadow-sm border-0" style={{ borderTop: '4px solid #0d6efd', backgroundColor: '#f8fbfc' }}>
                            <div className="card-body d-flex flex-column align-items-center text-center">
                                <h5 className="card-title fw-bold text-uppercase text-primary mb-3">Cocina</h5>
                                <QRCodeSVG
                                    value={`${baseUrl}/?cocina=true`}
                                    size={150}
                                    level="H"
                                    includeMargin={true}
                                    fgColor="#0d6efd"
                                />
                                <div className="mt-3">
                                    <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm">👨‍🍳 Cocina </span>
                                </div>
                                <small className="text-muted mt-3 font-monospace" style={{ fontSize: '0.65rem' }}>{`${baseUrl}/?cocina=true`}</small>
                            </div>
                        </div>
                    </div>
                )}

                {/* QR MESERO */}
                {includeStaff && (
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
                                    <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">📋 Mesero</span>
                                </div>
                                <small className="text-muted mt-3 font-monospace" style={{ fontSize: '0.65rem' }}>{`${baseUrl}/?mesero=true`}</small>
                            </div>
                        </div>
                    </div>
                )}

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
