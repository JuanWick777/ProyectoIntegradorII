import React from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Card from './ui/Card';
import Button from './ui/Button';

const ProductCard = ({ product }) => {
    const { agregarAlCarrito } = useAppStore();

    return (
        <Card image={product.image}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
            </div>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-xl text-gray-900">${product.price}</span>
                <Button
                    onClick={() => agregarAlCarrito(product)}
                    variant="primary"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0"
                    aria-label="Agregar al carrito"
                >
                    <Plus size={24} strokeWidth={3} />
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
