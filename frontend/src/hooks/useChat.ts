import { useState, useEffect } from 'react';
import { sendMessage } from '../services/chatService';
import { ChatMessage } from '../types/chat';

const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendChatMessage = async (message: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await sendMessage(message);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: message, sender: 'user' },
                { text: response.data, sender: 'bot' },
            ]);
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        error,
        sendChatMessage,
    };
};

export default useChat;