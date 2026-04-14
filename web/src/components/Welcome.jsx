import React, { useState } from 'react';
import { QrCode, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PrimaryButton } from './ui/Button';

const Welcome = () => {
    const { setNumeroMesa } = useAppStore();
    const [manualInput, setManualInput] = useState('');

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualInput.trim()) {
            setNumeroMesa(parseInt(manualInput));
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-orange-100 p-6 rounded-full mb-8 animate-pulse">
                <QrCode size={64} className="text-orange-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Bienvenido!
            </h1>

            <p className="text-gray-500 mb-8 max-w-md text-lg">
                Para comenzar a ordenar, por favor escanea el código QR que se encuentra en tu mesa.
            </p>

            <div className="w-full max-w-xs border-t border-gray-100 pt-8">
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-semibold">
                    ¿Problemas con el QR?
                </p>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Mesa #"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                    />
                        <PrimaryButton
                        type="submit"
                        className="rounded-lg p-0 w-12 h-12"
                        disabled={!manualInput.trim()}
                    >
                        <ArrowRight />
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
};

export default Welcome;
