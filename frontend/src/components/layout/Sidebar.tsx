import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-full bg-gray-800 text-white">
            <h2 className="text-xl font-bold p-4">Manufacturing SOP & Safety Bot</h2>
            <nav className="mt-4">
                <ul>
                    <li className="p-2 hover:bg-gray-700">
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <a href="/chat">Chat</a>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <a href="/documents">Documents</a>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <a href="/safety">Safety</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;