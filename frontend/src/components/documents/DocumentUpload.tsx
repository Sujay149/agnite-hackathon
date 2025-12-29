import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await axios.post('/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded successfully: ' + response.data.fileName);
        } catch (error) {
            setMessage('Error uploading file: ' + (error as Error).message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4">
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
                onClick={handleUpload}
                disabled={uploading}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${uploading ? 'opacity-50' : ''}`}
            >
                {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
};

export default DocumentUpload;