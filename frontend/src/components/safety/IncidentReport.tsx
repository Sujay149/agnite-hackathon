import React, { useState } from 'react';

const IncidentReport: React.FC = () => {
    const [incidentDetails, setIncidentDetails] = useState('');
    const [reportStatus, setReportStatus] = useState('');

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/safety/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ details: incidentDetails }),
            });

            if (response.ok) {
                setReportStatus('Incident reported successfully!');
                setIncidentDetails('');
            } else {
                setReportStatus('Failed to report incident. Please try again.');
            }
        } catch (error) {
            setReportStatus('An error occurred. Please try again.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Report an Incident</h2>
            <form onSubmit={handleReportSubmit}>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    rows={4}
                    value={incidentDetails}
                    onChange={(e) => setIncidentDetails(e.target.value)}
                    placeholder="Describe the incident..."
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Submit Report
                </button>
            </form>
            {reportStatus && <p className="mt-4">{reportStatus}</p>}
        </div>
    );
};

export default IncidentReport;