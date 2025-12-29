import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { sendMessage } from '../../services/chatService';
import { ChatMessage } from '../../types/chat';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSendMessage = async (message: string) => {
        const newMessage: ChatMessage = { text: message, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(true);

        try {
            const response = await sendMessage(message);
            const botMessage: ChatMessage = { text: response.data, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <MessageList messages={messages} loading={loading} />
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatInterface;