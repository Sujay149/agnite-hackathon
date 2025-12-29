import React from 'react';

interface ChatMessageProps {
    message: string;
    sender: 'user' | 'bot';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
    return (
        <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-2 rounded-lg ${sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {message}
            </div>
        </div>
    );
};

export default ChatMessage;