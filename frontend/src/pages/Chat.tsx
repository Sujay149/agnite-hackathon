import React, { useEffect, useState } from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { fetchChatHistory, sendMessage } from '../services/chatService';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadChatHistory = async () => {
            const chatHistory = await fetchChatHistory();
            setMessages(chatHistory);
            setLoading(false);
        };

        loadChatHistory();
    }, []);

    const handleSendMessage = async (message: string) => {
        const newMessage = { text: message, sender: 'user' };
        setMessages((prev) => [...prev, newMessage]);

        const response = await sendMessage(message);
        setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
    };

    return (
        <div className="flex flex-col h-screen">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading...</p>
                </div>
            ) : (
                <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};

export default Chat;