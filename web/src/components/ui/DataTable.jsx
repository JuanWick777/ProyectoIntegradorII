import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({
    columns,
    data,
    emptyMessage = 'No data',
    loading = false,
    className = '',
}) => {
    return (
        <div className={`card border-0 shadow-sm ${className}`} style={{ borderRadius: '1rem', overflow: 'hidden' }}>
            {loading ? (
                <LoadingSpinner center />
            ) : (
                <table className="table table-hover mb-0">
                    <thead style={{ background: '#51443B' }}>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className={col.className || ''} style={{ color: '#000000' }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id || index} className="align-middle">
                                {columns.map(col => (
                                    <td key={col.key} className={col.className || ''} style={{ verticalAlign: 'middle' }}>
                                        <div className="d-flex flex-column">
                                            <span className="text-muted small d-md-none">{col.label}</span>
                                            <div>{col.render ? col.render(item) : item[col.key]}</div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5 text-muted">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DataTable;