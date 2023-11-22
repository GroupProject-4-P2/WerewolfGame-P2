import { useState } from 'react';
export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedMessages = [...messages, { text: newMessage, timestamp: new Date() }];
    setMessages(updatedMessages);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex w-full mt-2 ${index % 2 === 0 ? 'ml-auto justify-end' : ''}`}>
              <div className={index % 2 === 0 ? 'flex-shrink-0 h-10 w-10 rounded-full bg-gray-300' : ''}></div>
              <div className={index % 2 === 0 ? 'ml-auto justify-end' : ''}>
                <div className={index % 2 === 0 ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 leading-none">2 min ago</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-300 p-4">
          <input
            className="flex items-center h-10 w-full rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
      </div>
    </div>
  )
}