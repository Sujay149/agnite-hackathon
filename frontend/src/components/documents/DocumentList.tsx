import React, { useEffect, useState } from 'react';
import { Document } from '../../types/document';
import { fetchDocuments } from '../../services/documentService';

const DocumentList: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDocuments = async () => {
            try {
                const docs = await fetchDocuments();
                setDocuments(docs);
            } catch (err) {
                setError('Failed to load documents');
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="document-list">
            <h2 className="text-xl font-bold mb-4">Documents</h2>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id} className="border-b py-2">
                        <a href={`/documents/${doc.id}`} className="text-blue-600 hover:underline">
                            {doc.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;