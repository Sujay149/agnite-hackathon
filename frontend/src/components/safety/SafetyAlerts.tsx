import React, { useEffect, useState } from 'react';
import { getSafetyAlerts } from '../../services/safetyService';

const SafetyAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await getSafetyAlerts();
                setAlerts(response);
            } catch (err) {
                setError('Failed to fetch safety alerts');
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Safety Alerts</h2>
            <ul className="list-disc pl-5">
                {alerts.map((alert, index) => (
                    <li key={index} className="mb-2">
                        {alert}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SafetyAlerts;