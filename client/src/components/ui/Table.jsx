import React from 'react';

export const Table = ({ columns, data, emptyMessage = 'No data found' }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-primary-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-200">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-sm font-semibold text-primary-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-primary-100 hover:bg-primary-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-primary-900">
                  {column.render ? column.render(row, index) : String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
