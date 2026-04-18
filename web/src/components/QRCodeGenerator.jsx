import React, { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Printer, FileDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import SectionHeader from './ui/SectionHeader';
import { PrimaryButton, SecondaryButton } from './ui/Button';

const DEFAULT_PUBLIC_APP_URL = 'https://subpanel-plating-underwent.ngrok-free.dev';

const getPublicAppUrl = () => {
    const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL || DEFAULT_PUBLIC_APP_URL;
    return configuredUrl.replace(/\/+$/, '');
};

const QRGenerator = () => {
    const { fetchMesas } = useAppStore();
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const publicAppUrl = useMemo(() => getPublicAppUrl(), []);
    const fechaImpresion = useMemo(() => new Date().toLocaleString(), []);

    const mesasOrdenadas = useMemo(() => {
        return [...mesas]
            .filter((mesa) => mesa?.numero != null)
            .sort((a, b) => Number(a.numero) - Number(b.numero));
    }, [mesas]);

    const cargarMesas = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchMesas();
            setMesas(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.message || 'No se pudieron cargar las mesas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMesas();
    }, []);

    const printPage = () => window.print();
    const printSingleMesa = (mesa) => {
        const qrUrl = `${publicAppUrl}/?mesa=${mesa.numero}`;
        const printWindow = window.open('', '_blank', 'width=900,height=700');

        if (!printWindow) {
            setError('No se pudo abrir la ventana de impresion. Revisa si el navegador bloqueo el popup.');
            return;
        }

        const qrSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
                <rect width="220" height="220" fill="#ffffff"></rect>
                <foreignObject width="220" height="220">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:220px;height:220px;">
                        ${document.querySelector(`[data-qr-mesa="${mesa.numero}"]`)?.innerHTML || ''}
                    </div>
                </foreignObject>
            </svg>
        `;

        printWindow.document.write(`
            <!doctype html>
            <html lang="es">
            <head>
                <meta charset="UTF-8" />
                <title>QR Mesa ${mesa.numero}</title>
                <style>
                    body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background: #f8f9fa;
                        color: #111827;
                    }
                    .sheet {
                        width: 100%;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 32px;
                        box-sizing: border-box;
                    }
                    .card {
                        width: 420px;
                        background: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-top: 6px solid #fd7e14;
                        border-radius: 24px;
                        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                        padding: 28px;
                        text-align: center;
                    }
                    .title {
                        margin: 0 0 8px;
                        font-size: 28px;
                        font-weight: 700;
                        text-transform: uppercase;
                        color: #374151;
                    }
                    .subtitle {
                        margin: 0 0 20px;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .qr-wrap {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 18px;
                        width: 240px;
                        height: 240px;
                        background: #ffffff;
                        border-radius: 20px;
                        border: 1px solid #e5e7eb;
                    }
                    .badge {
                        display: inline-block;
                        margin: 6px 6px 0;
                        padding: 10px 16px;
                        border-radius: 999px;
                        font-size: 14px;
                        font-weight: 700;
                    }
                    .badge-main {
                        background: #facc15;
                        color: #1f2937;
                    }
                    .badge-secondary {
                        background: #f8fafc;
                        color: #374151;
                        border: 1px solid #d1d5db;
                    }
                    .url {
                        margin-top: 18px;
                        font-size: 12px;
                        color: #6b7280;
                        word-break: break-all;
                    }
                    .note {
                        margin-top: 18px;
                        padding-top: 18px;
                        border-top: 1px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 13px;
                    }
                    @media print {
                        body {
                            background: #ffffff;
                        }
                        .sheet {
                            padding: 0;
                        }
                        .card {
                            box-shadow: none;
                            border: 1px solid #d1d5db;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="sheet">
                    <div class="card">
                        <h1 class="title">Mesa ${mesa.numero}</h1>
                        <p class="subtitle">Codigo QR individual para comensal</p>
                        <div class="qr-wrap">${qrSvg}</div>
                        <div>
                            <span class="badge badge-main">Comensal</span>
                            <span class="badge badge-secondary">Capacidad: ${mesa.capacidad || 0}</span>
                        </div>
                        <div class="url">${qrUrl}</div>
                        <div class="note">Escanea para abrir el menu de la mesa ${mesa.numero}</div>
                    </div>
                </div>
                <script>
                    window.onload = () => {
                        setTimeout(() => window.print(), 250);
                    };
                </script>
            </body>
            </html>
        `);

        printWindow.document.close();
    };

    return (
        <div className="container py-5 print-container">
            <header className="d-print-none mb-4">
                <div className="bg-white rounded-4 shadow-sm p-4 mb-4 border">
                    <SectionHeader
                        title="Generador de Codigos QR"
                        subtitle="Los codigos se generan solo con las mesas existentes en la base de datos."
                        actions={(
                            <div className="d-flex flex-wrap gap-2">
                                <SecondaryButton
                                    type="button"
                                    onClick={cargarMesas}
                                    disabled={loading}
                                    size="sm"
                                    className="fw-bold shadow-sm d-flex align-items-center gap-2"
                                    style={{ borderRadius: '1rem' }}
                                >
                                    <RefreshCw size={16} />
                                    {loading ? 'Cargando...' : 'Recargar mesas'}
                                </SecondaryButton>
                            </div>
                        )}
                        className="mb-3"
                    />

                    <div className="bg-light p-3 rounded-4 border">
                        <div className="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <div>
                                <span className="small text-muted d-block">URL publica usada en los QR</span>
                                <strong className="font-monospace">{publicAppUrl}</strong>
                            </div>
                            <div className="text-lg-end d-flex flex-column align-items-lg-end">
                                <span className="small text-muted d-block">Mesas disponibles</span>
                                <strong>{mesasOrdenadas.length}</strong>
                                <span className="small text-muted mt-1">Impresion: {fechaImpresion}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 d-flex align-items-start gap-2 small text-muted">
                        <FileDown size={16} className="mt-1 flex-shrink-0" />
                        <span>Usa el boton individual de cada tarjeta para imprimir o guardar el QR como PDF sin arrastrar el resto del panel.</span>
                    </div>
                </div>
            </header>

            {error && (
                <div className="alert alert-danger d-print-none mb-3" role="alert">
                    {error}
                </div>
            )}

            {!loading && mesasOrdenadas.length === 0 && !error && (
                <div className="alert alert-warning d-print-none mb-3" role="alert">
                    No hay mesas registradas en la base de datos.
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center py-5 d-print-none">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-none d-print-block print-sheet-header mb-4">
                        <div className="text-center mb-3">
                            <h2 className="fw-bold mb-1">Codigos QR de Mesas</h2>
                            <div className="text-muted">Restaurante · {mesasOrdenadas.length} mesas registradas</div>
                        </div>
                        <div className="d-flex justify-content-between small text-muted border rounded-4 px-4 py-3">
                            <span>Base publica: {publicAppUrl}</span>
                            <span>Generado: {fechaImpresion}</span>
                        </div>
                    </div>

                <div className="row g-4 print-row">
                    {mesasOrdenadas.map((mesa) => {
                        const qrUrl = `${publicAppUrl}/?mesa=${mesa.numero}`;

                        return (
                            <div key={mesa.id ?? mesa.numero} className="col-sm-6 col-md-4 col-lg-3 page-break-avoid">
                                <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{
                                        borderTop: '4px solid #fd7e14',
                                        borderRadius: '1.2rem',
                                        backgroundColor: '#ffffff',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div className="card-body d-flex flex-column align-items-center text-center">
                                        <h5 className="card-title fw-bold text-uppercase text-secondary mb-3">
                                            Mesa {mesa.numero}
                                        </h5>
                                        <div data-qr-mesa={mesa.numero}>
                                            <QRCodeSVG
                                                value={qrUrl}
                                                size={150}
                                                level="H"
                                                includeMargin
                                                fgColor="#212529"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <div className="d-flex flex-column align-items-center gap-2">
                                                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                                                    Comensal
                                                </span>
                                                <span className="badge text-bg-light border px-3 py-2 rounded-pill">
                                                    Capacidad: {mesa.capacidad || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <small
                                            className="text-muted mt-3 font-monospace"
                                            style={{ fontSize: '0.65rem' }}
                                        >
                                            {qrUrl}
                                        </small>
                                        <div className="mt-3 pt-3 w-100 border-top small text-muted">
                                            Escanea para abrir el menu de la mesa {mesa.numero}
                                        </div>
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => printSingleMesa(mesa)}
                                            size="sm"
                                            className="mt-3 fw-bold d-print-none"
                                            style={{ borderRadius: '0.9rem' }}
                                        >
                                            <Printer size={15} className="me-2" />
                                            Imprimir / PDF
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                </>
            )}

            <style jsx="true">{`
                @media print {
                    .d-print-none { display: none !important; }
                    .page-break-avoid { break-inside: avoid; page-break-inside: avoid; margin-bottom: 20px; }
                    .print-container { padding: 0 !important; max-width: 100% !important; background: white !important; }
                    .shadow-sm { box-shadow: none !important; border: 1px solid #dee2e6 !important; }
                    .print-sheet-header {
                        display: block !important;
                    }
                    .print-row {
                        row-gap: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default QRGenerator;
