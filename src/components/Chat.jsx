import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../axios'; 
import echo from '../utils/echo'; 

const Chat = ({ usuarioActual }) => { 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Usamos axiosClient para obtener el historial
        axiosClient.get('/messages').then(response => {
            setMessages(response.data);
            scrollToBottom();
        });

        const channel = echo.private('chat');
        channel.listen('.message.sent', (e) => {
            setMessages(prev => {
                if (e.id) {
                    const exists = prev.some(msg => String(msg.id) === String(e.id));
                    if (exists) return prev;
                }
                
                const uniqueId = e.id ? e.id : `temp-${Date.now()}`;

                return [...prev, {
                    id: uniqueId,
                    message: e.message,
                    user_id: e.user_id, 
                    usuario: { persona: { nombre: e.user_name } }, 
                    created_at: e.created_at,
                    is_mine: (String(usuarioActual.id) === String(e.user_id)) 
                }];
            });
            setTimeout(scrollToBottom, 100);
        });

        return () => echo.leave('chat');
    }, [usuarioActual.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            // Usamos axiosClient para enviar el mensaje
            const response = await axiosClient.post('/messages', { message: newMessage });
            const msgResponse = response.data.message;
            
            msgResponse.is_mine = true; 
            msgResponse.user_id = usuarioActual.id; 
            
            setMessages(prev => [...prev, msgResponse]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-white relative">
            <div className="px-8 py-6 flex justify-between items-center bg-white shrink-0">
                 <button className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-md hover:opacity-90 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <h1 className="text-4xl font-bold text-brand-green">Chat</h1>
            </div>

            <div className="mx-8 mb-4 bg-brand-orange rounded-xl p-4 flex items-center gap-4 text-white shadow-lg shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                    <img src="https://placehold.co/100?text=C4" alt="Chat" className="w-full h-full object-cover"/>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Chat Condominio</h3>
                    <p className="text-sm opacity-90">Canal General</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 bg-white scroll-smooth">
                {messages.map((msg, index) => {
                   
                    // Buscamos el ID en user_id, usuario_id, o dentro del objeto usuario
                    const msgUserId = msg.user_id || msg.usuario_id || msg.usuario?.id || msg.user?.id;
                    
                    // Comparamos como Texto para evitar errores (1 vs "1")
                    const isMe = msg.is_mine || (String(msgUserId) === String(usuarioActual.id));
                    
                    // LÓGICA ROBUSTA PARA EL NOMBRE
                    const nombreMostrar = msg.user_name || msg.usuario?.persona?.nombre  || msg.usuario?.nombre  || msg.user?.name  || 'Usuario';

                    const keyId = msg.id ? msg.id : `msg-${index}`;

                    return (
                        <div key={keyId} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            
                            {!isMe && (
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0 mt-2 border border-gray-100">
                                     <img 
                                        // Usamos el nombre real para generar las iniciales
                                        src={`https://ui-avatars.com/api/?name=${nombreMostrar}&background=random`} 
                                        alt="User" className="w-full h-full object-cover"
                                     />
                                </div>
                            )}

                            <div className={`relative max-w-[65%] px-6 py-4 text-sm shadow-sm ${
                                isMe 
                                    ? 'bg-brand-orange text-white rounded-2xl rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-indigo-100 rounded-2xl rounded-bl-none'
                            }`}>
                                {!isMe && (
                                    <span className="block text-brand-orange font-bold text-xs mb-1">
                                        {nombreMostrar}
                                    </span>
                                )}
                                <p className="leading-relaxed">{msg.message}</p>
                                <span className={`text-[10px] block text-right mt-2 font-medium ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white shrink-0">
                <form onSubmit={sendMessage} className="flex gap-4 items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                    <button type="submit" className="bg-brand-orange text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 shadow-md transition">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;