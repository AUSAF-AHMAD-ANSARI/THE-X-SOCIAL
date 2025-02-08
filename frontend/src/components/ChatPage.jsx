import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    },[]);

    return (
        <div className='flex ml-[16%] h-screen bg-gradient-to-r from-gray-50 to-blue-50'>
            <section className='w-full md:w-1/4 my-8 pr-4'>
                <div className='px-4'>
                    <h1 className='font-bold mb-4 text-2xl text-gray-800'>{user?.username}</h1>
                    <hr className='mb-6 border-gray-200' />
                </div>
                <div className='overflow-y-auto h-[80vh] pr-2 custom-scrollbar'>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div 
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                className={`flex gap-3 items-center p-3 mb-2 rounded-xl transition-all cursor-pointer
                                    ${selectedUser?._id === suggestedUser._id 
                                        ? 'bg-blue-100 border-2 border-blue-200' 
                                        : 'hover:bg-white hover:shadow-sm border-2 border-transparent'}`}
                            >
                                <div className='relative'>
                                    <Avatar className='w-12 h-12'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback className='bg-blue-100'>
                                            {suggestedUser.username[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isOnline && (
                                        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white' />
                                    )}
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-medium text-gray-700'>{suggestedUser?.username}</span>
                                    <span className='text-xs text-gray-500'>
                                        {isOnline ? 'Active now' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {selectedUser ? (
                <section className='flex-1 flex flex-col h-full bg-white shadow-lg rounded-tl-xl overflow-hidden'>
                    <div className='flex gap-3 items-center px-6 py-4 border-b border-gray-200 bg-white'>
                        <div className='relative'>
                            <Avatar className='w-10 h-10'>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback className='bg-blue-100'>
                                    {selectedUser.username[0]}
                                </AvatarFallback>
                            </Avatar>
                            {onlineUsers.includes(selectedUser._id) && (
                                <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white' />
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-gray-800'>{selectedUser?.username}</span>
                            <span className='text-xs text-gray-500'>
                                {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    
                    <Messages selectedUser={selectedUser} />
                    
                    <div className='flex items-center p-4 bg-gray-50 border-t border-gray-200'>
                        <Input 
                            value={textMessage} 
                            onChange={(e) => setTextMessage(e.target.value)}
                            type="text" 
                            className='flex-1 mr-3 bg-white rounded-full px-6 py-5 focus-visible:ring-blue-500'
                            placeholder="Type a message..." 
                            onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler(selectedUser?._id)}
                        />
                        <Button 
                            onClick={() => sendMessageHandler(selectedUser?._id)}
                            className='rounded-full px-6 py-5 bg-blue-600 hover:bg-blue-700 transition-colors'
                        >
                            Send
                        </Button>
                    </div>
                </section>
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50'>
                    <MessageCircleCode className='w-40 h-40 text-blue-200 mb-8' strokeWidth={1} />
                    <h1 className='text-3xl font-light text-gray-800 mb-2'>Your Messages</h1>
                    <p className='text-gray-500'>Select a conversation or start a new one</p>
                </div>
            )}
        </div>
    )
}

export default ChatPage;

// Add this to your global CSS
<style jsx>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>