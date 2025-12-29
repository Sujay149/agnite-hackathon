import React from 'react';
import DocumentList from '../components/documents/DocumentList';
import DocumentUpload from '../components/documents/DocumentUpload';

const Documents: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Documents</h1>
            <DocumentUpload />
            <DocumentList />
        </div>
    );
};

export default Documents;