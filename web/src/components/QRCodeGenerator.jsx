import React, { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw } from 'lucide-react';
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
                                <PrimaryButton
                                    type="button"
                                    onClick={printPage}
                                    disabled={loading || mesasOrdenadas.length === 0}
                                    size="sm"
                                    className="fw-bold shadow-sm px-4"
                                    style={{ borderRadius: '1rem' }}
                                >
                                    <i className="bi bi-printer me-2"></i>Imprimir QR
                                </PrimaryButton>
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
                            <div className="text-lg-end">
                                <span className="small text-muted d-block">Mesas disponibles</span>
                                <strong>{mesasOrdenadas.length}</strong>
                            </div>
                        </div>
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
                                        <QRCodeSVG
                                            value={qrUrl}
                                            size={150}
                                            level="H"
                                            includeMargin
                                            fgColor="#212529"
                                        />
                                        <div className="mt-3">
                                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                                                Comensal
                                            </span>
                                        </div>
                                        <small
                                            className="text-muted mt-3 font-monospace"
                                            style={{ fontSize: '0.65rem' }}
                                        >
                                            {qrUrl}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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
