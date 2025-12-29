import React from 'react';
import ChatMessage from './ChatMessage';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;