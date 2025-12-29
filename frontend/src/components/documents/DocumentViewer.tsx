import React from 'react';

interface DocumentViewerProps {
    document: {
        title: string;
        content: string;
    };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
    return (
        <div className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">{document.title}</h2>
            <div className="whitespace-pre-wrap">{document.content}</div>
        </div>
    );
};

export default DocumentViewer;