import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            <p className="text-lg mb-8">Welcome, {user?.name}!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/chat" className="p-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                    Chat with Bot
                </Link>
                <Link to="/documents" className="p-4 bg-green-500 text-white rounded shadow hover:bg-green-600">
                    View Documents
                </Link>
                <Link to="/safety" className="p-4 bg-red-500 text-white rounded shadow hover:bg-red-600">
                    Safety Reports
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;