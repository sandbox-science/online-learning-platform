import React from 'react';
import { useParams } from 'react-router-dom';

export function Course() {
    const { id } = useParams(); 

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Course Name</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                Course id: {id}
            </div>
        </div>
    );
}
