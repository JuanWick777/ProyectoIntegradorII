import React from 'react';

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
    return (
        <div className="sticky top-16 z-40 bg-gray-50/95 backdrop-blur-sm pt-2 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex px-4 gap-3 min-w-max">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        style={activeCategory === cat.id ? {
                            backgroundColor: '#FF7A00',
                            color: '#FFFFFF',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s duration',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transform: 'scale(1.05)'
                        } : {
                            backgroundColor: '#FFFFFF',
                            color: '#FF7A00',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            border: '2px solid #FF7A00',
                            cursor: 'pointer',
                            transition: 'all 0.2s duration'
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default CategoryTabs;
