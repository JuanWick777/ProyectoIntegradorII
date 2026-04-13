import React from 'react';

/**
 * Card.jsx — Componente base reutilizable para contenedores con estilos consistentes.
 *
 * Props:
 *   variant: 'default' | 'elevated' — Estilo base (default: sombra sutil, elevated: más prominente).
 *   children: Contenido interno del card.
 *   image: URL de imagen opcional para mostrar arriba.
 *   className: Clases adicionales de Tailwind para personalización.
 *   onClick: Función opcional para hacer el card clickeable.
 *   ...props: Otros props pasan al div raíz.
 */
const Card = ({
    variant = 'default',
    children,
    image,
    className = '',
    onClick,
    ...props
}) => {
    // Estilos base según variante, usando Tailwind
    const baseClasses = 'bg-white border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all';
    const variantClasses = {
        default: 'rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98]',
        elevated: 'rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98]',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

    return (
        <div
            className={combinedClasses}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer' } : {}}
            {...props}
        >
            {image && (
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default Card;