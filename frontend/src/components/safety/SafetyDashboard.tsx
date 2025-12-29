import React, { useEffect, useState } from 'react';
import { getSafetyData } from '../../services/safetyService';
import SafetyAlert from './SafetyAlerts';

const SafetyDashboard: React.FC = () => {
    const [safetyData, setSafetyData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSafetyData = async () => {
            try {
                const data = await getSafetyData();
                setSafetyData(data);
            } catch (err) {
                setError('Failed to fetch safety data');
            } finally {
                setLoading(false);
            }
        };

        fetchSafetyData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Safety Dashboard</h1>
            <div className="grid grid-cols-1 gap-4">
                {safetyData.map((alert) => (
                    <SafetyAlert key={alert.id} alert={alert} />
                ))}
            </div>
        </div>
    );
};

export default SafetyDashboard;